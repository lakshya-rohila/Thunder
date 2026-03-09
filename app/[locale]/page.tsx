"use client";

import React, { useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/modules/Auth/AuthActions";

import HeroSection from "@/components/landing/HeroSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PhilosophySection from "@/components/landing/PhilosophySection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#DFFF00]/30 selection:text-white">
      {/* ── Navigation ─────────────────────────────────── */}
      <LandingNavbar />

      {/* ── Hero Section ───────────────────────────────── */}
      <HeroSection isLoggedIn={isLoggedIn} isLoading={isLoading} />

      {/* ── Showcase ────────────────────────────────────── */}
      <ShowcaseSection />

      {/* ── Capabilities Section ────────────────────────── */}
      <FeaturesSection />

      {/* ── Use Cases ───────────────────────────────────── */}
      <UseCasesSection />

      {/* ── How It Works ───────────────────────────────── */}
      <HowItWorksSection />

      {/* ── Testimonials ────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── Philosophy Section ─────────────────────────── */}
      <PhilosophySection />

      {/* ── FAQ Section ────────────────────────────────── */}
      <FAQSection />

      {/* ── Final CTA Section ──────────────────────────── */}
      <CTASection isLoggedIn={isLoggedIn} isLoading={isLoading} />

      {/* ── Footer ─────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
