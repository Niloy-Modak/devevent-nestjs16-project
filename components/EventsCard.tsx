import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventsCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <div>
      <Link href={"/events"} id="event-card">
        <Image
          width={410}
          height={300}
          src={image}
          alt="title"
          className="poster"
        />
        {/* location */}
        <div className="flex flex-row gap-2">
          <Image src={"/icons/pin.svg"} alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>
        
        {/* title */}
        <p className="title">{title}</p>

        {/* date & time */}
        <div className="datetime">
          <div className="flex flex-row gap-2">
            <Image
              src={"/icons/calendar.svg"}
              alt="date"
              width={14}
              height={14}
            />
            <p>{date}</p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src={"/icons/clock.svg"} alt="time" width={14} height={14} />
            <p>{time}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventsCard;
