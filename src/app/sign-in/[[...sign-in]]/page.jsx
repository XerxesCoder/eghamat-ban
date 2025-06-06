"use client";
import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignInUser() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#00E5FF",
            colorText: "#0A2463",
            fontFamily: "Vazir, sans-serif",
          },
          elements: {
            formButtonPrimary: "bg-aqua-spark hover:bg-aqua-spark/90",
            footerActionLink: "text-deep-ocean hover:text-aqua-spark",
          },
        }}
      />
    </div>
  );
}
