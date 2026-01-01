import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidateTag } from "next/cache";

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

    const file = fromData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "image file is required" },
        { status: 400 }
      );
    }

    const tags = JSON.parse(fromData.get("tags") as string)
    const agenda = JSON.parse(fromData.get("agenda") as string)
    

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvents" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        ).end(buffer);
    });

    event.image = (uploadResult as {secure_url: string}).secure_url

    const createdEvent = await Event.create({
      ...event, 
      tags : tags, 
      agenda: agenda
    });

    // for caching
    revalidateTag("events", {});

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


export async function GET() {
  try {
    await connectDB()
    const events = await Event.find().sort({createdAt: -1})

    return NextResponse.json({ message: "Event fetched successfully", events }, { status: 200 });
  } catch (err) {
    return NextResponse.json({message: "Event fetching failed", error: err}, {status: 500})
  }
}