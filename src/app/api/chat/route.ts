import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ text: "I didn't quite catch that. Could you repeat?" }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    let reply = "I'm still learning! Right now, I can help you post an ad, find items, or navigate the dashboard. What would you like to do?";

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = "Hello there! How can I help you navigate HitAds today?";
    } else if (lowerMessage.includes('post') || lowerMessage.includes('sell') || lowerMessage.includes('ad')) {
      reply = "To post a new ad, simply click the 'Post Ad' button in the top navigation bar! It's completely free.";
    } else if (lowerMessage.includes('buy') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
      reply = "You can use the search bar at the top of the page to find exactly what you're looking for, or browse our categories.";
    } else if (lowerMessage.includes('message') || lowerMessage.includes('contact') || lowerMessage.includes('chat')) {
      reply = "If you're interested in an item, click on the ad and use the 'Contact Seller' box to send them a direct message!";
    }

    return NextResponse.json({ text: reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ text: "I'm currently undergoing maintenance. Please check back later!" }, { status: 500 });
  }
}
