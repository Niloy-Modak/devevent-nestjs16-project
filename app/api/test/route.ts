import connectDB from "@/lib/mongodb";


export const runtime = "nodejs"; // IMPORTANT! Not Edge Runtime

export async function GET() {
  await connectDB();
  return Response.json({ message: "DB Connected" });
}
