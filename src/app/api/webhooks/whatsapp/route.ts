import { NextResponse } from "next/server";
import { whatsapp } from "@/lib/whatsapp";
// Import the AI function we can use to generate replies
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Verification endpoint for WhatsApp Webhook setup
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse("Forbidden", { status: 403 });
  }

  return new NextResponse("Bad Request", { status: 400 });
}

// Receive incoming messages
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from; // sender phone number
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // text message
        
        console.log(`Received message from ${from}: ${msgBody}`);

        // AI Auto-Reply Logic
        const result = await streamText({
          model: openai('gpt-4-turbo'),
          system: "You are an AI customer support assistant for FlowPilot. Reply concisely, professionally, and try to assist the user with their inquiry.",
          messages: [{ role: "user", content: msgBody }],
        });
        
        let aiResponse = "";
        for await (const chunk of result.textStream) {
          aiResponse += chunk;
        }

        // Send reply back via WhatsApp
        await whatsapp.sendMessage({
          to: from,
          type: "text",
          text: aiResponse
        });
      }
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
