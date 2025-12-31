import BookEvents from "@/components/BookEvents";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const EventDetailsItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)
  


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const response = await fetch(`${BASE_URL}/api/events/${slug}`);

  const {
    event: {
      title,
      description,
      overview,
      image,
      venue,
      location,
      date,
      mode,
      audience,
      agenda,
      organizer,
      tags,
      time,
    },
  } = await response.json();
  //   console.log(event);
  if (!title) return notFound();

  const bookings = 10

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details ">
        {/* Left side Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2 ">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2 ">
            <h2 className="">Event Details</h2>
            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="calender"
              label={formattedDate}
            />
            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="clock"
              label={time}
            />
            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailsItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <section>
            <EventAgenda agendaItems={JSON.parse(agenda[0])} />
          </section>

          <section className="flex-col-gap-2 ">
            <h2>About the Organizer</h2>
            <p> {organizer} </p>
          </section>

          <section>
            <EventTags tags={JSON.parse(tags[0])}/>
          </section>
        </div>

        {/* Right side - Booking From */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings >0 ?(
              <p className="text-sm">
                Join {bookings} people who have al ready booked their spot !
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot !
              </p>
            )}

            <BookEvents/>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
