"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AuthLayout({ children }) {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* 🔹 Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900 to-gray-900" />

      {/* 🔹 Lottie Background Animation */}
      <div className="absolute inset-0 z-0 flex items-end justify-center opacity-70">
        <DotLottieReact
          src="https://lottie.host/e6209e35-f8b1-444b-984b-60a13b7c9d0a/2mBnBaTLgd.lottie"
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userSelect: "none",
            filter: "brightness(0.5)",
            position: "hidden",
          }}
        />
      </div>

      {/* 🔹 Main Auth Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="w-1/3">{children}</div>
      </div>
    </div>
  );
}
