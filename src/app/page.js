import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/Landing/AppHeader";
import Footer from "@/components/Landing/Footer";
import Hero from "@/components/Landing/Hero";
import Fearures from "@/components/Landing/Fearures";
import Demo from "@/components/Landing/Demo";
import Testimonials from "@/components/Landing/Testimonials";
import CTA from "@/components/Landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white w-full flex flex-col justify-center items-center">
      {/* Navigation */}
      <AppHeader />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Fearures />

      {/* Demo Section */}
      <Demo />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Final CTA Section */}
      <CTA />

      <Footer />
    </main>
  );
}
