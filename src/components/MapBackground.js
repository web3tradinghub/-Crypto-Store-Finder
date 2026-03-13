
"use client"
import React from "react";

const MapBackground = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/night-sky-loop.mp4"
      />
    </div>
  );
};

export default MapBackground;
