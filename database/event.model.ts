import { Schema, model, models, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

EventSchema.index({ slug: 1 }, { unique: true });

/**
 * NO next() HERE
 */
EventSchema.pre<IEvent>("save", async function () {
  // Required validation
  const required: Array<keyof IEvent> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of required) {
    const value = this[field];
    if (!value || (typeof value === "string" && !value.trim())) {
      throw new Error(`${field} is required`);
    }
  }

  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  const parsed = new Date(this.date);
  if (isNaN(parsed.getTime())) throw new Error("Invalid date");
  this.date = parsed.toISOString();

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(this.time)) {
    throw new Error("Invalid time format. Use HH:mm");
  }
});

const Event: Model<IEvent> =
  models.Event || model<IEvent>("Event", EventSchema);

export default Event;
