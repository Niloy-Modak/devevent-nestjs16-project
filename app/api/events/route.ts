import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
  try {
    await connectDB();

    const fromData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(fromData.entries());
    } catch (e) {
      return NextResponse.json({ message: " JSON data from" }, { status: 400 });
    }

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: " Event create successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "Event Creation Failed",
      error: e instanceof Error ? e.message : "Unknown",
    });
  }
}

