import { Schema, model, models, Document, Model, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save
 * - Validate email
 * - Ensure referenced event exists
 */
BookingSchema.pre<IBooking>("save", async function () {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(this.email)) {
    throw new Error("Invalid email format");
  }

  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist");
  }
});

const Booking: Model<IBooking> =
  models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
