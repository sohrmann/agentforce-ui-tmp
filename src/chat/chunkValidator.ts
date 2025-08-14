export type TextChunk = {
  chunk: string;
  offset: number;
};

export type ChunkValidationResult = {
  isComplete: boolean;
  hasGaps: boolean;
  missingOffsets: number[];
  duplicateOffsets: number[];
  assembledText: string;
  totalExpectedLength?: number;
};

export class ChunkValidator {
  private chunks: Map<number, string> = new Map();
  private maxOffset = -1;
  private expectedLength?: number;

  /**
   * Add a chunk and validate its position
   */
  addChunk(chunk: string, offset: number): ChunkValidationResult {
    // Validate input
    if (typeof offset !== 'number' || offset < 0) {
      console.warn(`Invalid offset received: ${offset}`);
      return this.getCurrentState();
    }

    if (typeof chunk !== 'string') {
      console.warn(`Invalid chunk type received: ${typeof chunk}`);
      return this.getCurrentState();
    }

    // Check for duplicate offset
    const duplicateOffsets: number[] = [];
    if (this.chunks.has(offset)) {
      duplicateOffsets.push(offset);
      console.warn(`Duplicate chunk offset received: ${offset}`);
    }

    // Store the chunk
    this.chunks.set(offset, chunk);
    this.maxOffset = Math.max(this.maxOffset, offset);

    return this.getCurrentState();
  }

  /**
   * Set the expected total length when known (e.g., from server metadata)
   */
  setExpectedLength(length: number): void {
    this.expectedLength = length;
  }

  /**
   * Get current validation state and assembled text
   */
  getCurrentState(): ChunkValidationResult {
    const sortedOffsets = Array.from(this.chunks.keys()).sort((a, b) => a - b);
    const missingOffsets: number[] = [];
    const duplicateOffsets: number[] = [];
    
    // Check for gaps in sequence
    let expectedOffset = 0;
    let assembledText = '';
    
    for (const offset of sortedOffsets) {
      // Fill gaps with empty string if we have chunks after the gap
      while (expectedOffset < offset) {
        missingOffsets.push(expectedOffset);
        expectedOffset++;
      }
      
      // Add the chunk text
      const chunkText = this.chunks.get(offset) || '';
      assembledText += chunkText;
      expectedOffset = offset + chunkText.length;
    }

    const hasGaps = missingOffsets.length > 0;
    const isComplete = this.isSequenceComplete();

    return {
      isComplete,
      hasGaps,
      missingOffsets,
      duplicateOffsets,
      assembledText,
      totalExpectedLength: this.expectedLength
    };
  }

  /**
   * Check if the chunk sequence appears complete
   */
  private isSequenceComplete(): boolean {
    if (this.chunks.size === 0) return false;
    
    // If we have expected length, check against it
    if (this.expectedLength !== undefined) {
      const currentLength = this.getCurrentState().assembledText.length;
      return currentLength >= this.expectedLength;
    }

    // Otherwise, check for contiguous sequence from 0
    const sortedOffsets = Array.from(this.chunks.keys()).sort((a, b) => a - b);
    
    if (sortedOffsets[0] !== 0) return false;
    
    let expectedOffset = 0;
    for (const offset of sortedOffsets) {
      if (offset !== expectedOffset) return false;
      const chunkText = this.chunks.get(offset) || '';
      expectedOffset += chunkText.length;
    }
    
    return true;
  }

  /**
   * Reset the validator for a new message
   */
  reset(): void {
    this.chunks.clear();
    this.maxOffset = -1;
    this.expectedLength = undefined;
  }

  /**
   * Get diagnostic information for debugging
   */
  getDiagnostics(): {
    chunkCount: number;
    maxOffset: number;
    offsets: number[];
    totalLength: number;
  } {
    const offsets = Array.from(this.chunks.keys()).sort((a, b) => a - b);
    return {
      chunkCount: this.chunks.size,
      maxOffset: this.maxOffset,
      offsets,
      totalLength: this.getCurrentState().assembledText.length
    };
  }
}

/**
 * Utility function for simple chunk validation without maintaining state
 */
export function validateChunks(chunks: TextChunk[]): ChunkValidationResult {
  const validator = new ChunkValidator();
  
  for (const { chunk, offset } of chunks) {
    validator.addChunk(chunk, offset);
  }
  
  return validator.getCurrentState();
}

/**
 * Utility function to assemble chunks with basic validation
 */
export function assembleChunksWithValidation(chunks: TextChunk[]): {
  text: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (chunks.length === 0) {
    return { text: '', warnings };
  }

  // Sort chunks by offset
  const sortedChunks = [...chunks].sort((a, b) => a.offset - b.offset);
  
  // Check for duplicates
  const seenOffsets = new Set<number>();
  const uniqueChunks = sortedChunks.filter(chunk => {
    if (seenOffsets.has(chunk.offset)) {
      warnings.push(`Duplicate chunk at offset ${chunk.offset}`);
      return false;
    }
    seenOffsets.add(chunk.offset);
    return true;
  });

  // Check for gaps
  let expectedOffset = uniqueChunks[0]?.offset || 0;
  if (expectedOffset !== 0) {
    warnings.push(`Missing chunks before offset ${expectedOffset}`);
  }

  let assembledText = '';
  for (const { chunk, offset } of uniqueChunks) {
    if (offset > expectedOffset) {
      warnings.push(`Gap detected: missing chunks from ${expectedOffset} to ${offset}`);
    }
    assembledText += chunk;
    expectedOffset = offset + chunk.length;
  }

  return { text: assembledText, warnings };
} 