import { NextRequest, NextResponse } from "next/server";
import { sendStreamingMessage } from "@/chat/agentforce";

export async function POST(req: NextRequest) {
  const { message, sequenceId, agentId } = await req.json();
  const contentStream = await sendStreamingMessage(message, sequenceId, agentId);
  const headers = new Headers({
    "Content-Type": "text/event-stream",
  });
  return new NextResponse(contentStream, {
    status: 200,
    headers,
  });
}
