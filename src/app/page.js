"use client";
import AppHeader from "@/components/Landing/AppHeader";
import Footer from "@/components/Landing/Footer";
import Hero from "@/components/Landing/Hero";
import Fearures from "@/components/Landing/Fearures";
import Demo from "@/components/Landing/Demo";
import Testimonials from "@/components/Landing/Testimonials";
import CTA from "@/components/Landing/CTA";
import { useEffect } from "react";

export default function Home() {
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
    <main className="min-h-screen bg-white w-full flex flex-col justify-center items-center">
      <AppHeader />
      <Hero />
      <Fearures />
      <Demo />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
