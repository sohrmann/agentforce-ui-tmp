"use client";

type Props = {
  userMessage: string;
  sequenceId: number;
  agentId?: string;
  onSSEProgressIndicator: (message: string) => void;
  onSSETextChunk: (message: string, offset: number) => void;
  onSSEInform: (message: string) => void;
  onSSEEndOfTurn: () => void;
  onSSEError?: (error: string) => void;
};

export const sendStreamingMessage = async ({
  userMessage,
  sequenceId,
  agentId,
  onSSEProgressIndicator,
  onSSETextChunk,
  onSSEInform,
  onSSEEndOfTurn,
  onSSEError,
}: Props) => {
  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        message: userMessage,
        sequenceId,
        agentId,
      }),
    });

    if (!res.ok) {
      const errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      console.error("SSE request failed:", errorMessage);
      onSSEError?.(errorMessage);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      const errorMessage = "Failed to get response body reader";
      console.error(errorMessage);
      onSSEError?.(errorMessage);
      return;
    }

    const decoder = new TextDecoder();
    let buffer = ''; // Buffer for incomplete chunks

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        // Add new data to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE events
        const events = buffer.split('\n\n');
        
        // Keep the last incomplete event in buffer
        buffer = events.pop() || '';
        
        for (const event of events) {
          if (!event.trim()) continue;
          
          try {
            const lines = event.split('\n');
            let dataLine = '';
            
            // Find the data line in the SSE event
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                dataLine = line.substring(6); // Remove 'data: ' prefix
                break;
              }
            }
            
            if (!dataLine) {
              console.warn('No data line found in SSE event:', event);
              continue;
            }
            
            // Handle special SSE messages
            if (dataLine === '[DONE]' || dataLine === 'DONE') {
              onSSEEndOfTurn();
              continue;
            }
            
            // Parse JSON data
            let jsonData;
            try {
              jsonData = JSON.parse(dataLine);
            } catch (parseError) {
              console.warn('Failed to parse SSE JSON data:', dataLine, parseError);
              onSSEError?.(`Invalid JSON in SSE stream: ${parseError}`);
              continue;
            }
            
            // Handle API error responses
            if (jsonData.error && jsonData.type === 'error') {
              const errorMessage = jsonData.message || 'Unknown error occurred';
              console.error('API Error:', errorMessage);
              onSSEError?.(errorMessage);
              continue;
            }
            
            // Validate message structure
            if (!jsonData.message || typeof jsonData.message !== 'object') {
              console.warn('Invalid message structure in SSE data:', jsonData);
              onSSEError?.('Invalid message structure in SSE stream');
              continue;
            }
            
            const { type, message } = jsonData.message;
            
            if (!type) {
              console.warn('Missing or invalid type/message in SSE data:', jsonData.message);
              continue;
            }
            
            // Handle different message types
            switch (type) {
              case "ProgressIndicator":
                onSSEProgressIndicator(message);
                break;
                
              case "TextChunk":
                const offset = jsonData.offset;
                if (typeof offset !== 'number') {
                  console.warn('Invalid or missing offset for TextChunk:', jsonData);
                  onSSEError?.('Invalid offset in TextChunk');
                  continue;
                }
                onSSETextChunk(message, offset);
                break;
                
              case "Inform":
                onSSEInform(message);
                break;
                
              case "EndOfTurn":
                onSSEEndOfTurn();
                break;
                
              default:
                console.warn('Unknown SSE message type:', type);
                break;
            }
            
          } catch (eventError) {
            console.error('Error processing SSE event:', eventError, event);
            onSSEError?.(`Error processing SSE event: ${eventError}`);
          }
        }
      }
      
      // Process any remaining data in buffer
      if (buffer.trim()) {
        console.warn('Incomplete SSE data remaining in buffer:', buffer);
      }
      
    } finally {
      reader.releaseLock();
    }
    
  } catch (error) {
    console.error('SSE connection error:', error);
    onSSEError?.(`SSE connection failed: ${error}`);
  }
};
