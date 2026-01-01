"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";
import { unstable_cache } from "next/cache";

export const getSimilarEventSlug = unstable_cache(
  async (slug: string) => {
    try {
      await connectDB();

      const event = await Event.findOne({ slug });

      return await Event.find({
        _id: { $ne: event?._id },
        tags: { $in: event?.tags },
      }).lean();
    } catch {
      return [];
    }
  },
  ["similar-events"], // cache key
  { revalidate: 60 } // refresh every 60s
);
