"use client";
import Image from "next/image";
import React from "react";

const ExploreBtn = () => {
  return (
    <button
      id="explore-btn"
      type="button"
      onClick={() => console.log("Click explore")}
      className="mt-7 mx-auto"
    >
      <a href="#events">
        Explore Now
        <Image src={"/icons/arrow-down.svg"} alt="arrow-down" width={24} height={24} />
      </a>
    </button>
  );
};

export default ExploreBtn;
