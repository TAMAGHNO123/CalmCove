'use client';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { TipOfTheDay } from "@/components/TipOfTheDay";
import Link from "next/link";
import { Leaf, Calendar, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background zen-bg-pattern p-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-zen-sage/5 rounded-full blur-3xl zen-breathe" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-zen-blue/5 rounded-full blur-3xl zen-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="absolute top-6 right-6 flex items-center gap-3 zen-fade-in">
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-full text-foreground/70 hover:text-foreground hover:bg-zen-sage/10 transition-all duration-300">
              Dashboard
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="rounded-full border-zen-sage/30 hover:bg-zen-sage/10 hover:border-zen-sage transition-all duration-300">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-zen-sage-light to-zen-sage text-white mb-4 zen-float">
            <Leaf className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4"
        >
          Calm<span className="text-zen-sage">Cove</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed"
        >
          Your personal sanctuary for mental clarity. Find peace, track your wellness, and nurture your mind.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/quiz">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-zen-sage hover:bg-zen-sage-dark text-white shadow-lg shadow-zen-sage/20 hover:shadow-xl hover:shadow-zen-sage/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5 mr-2" />
              Take Wellness Quiz
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-zen-blue/30 text-zen-blue-dark hover:bg-zen-blue/10 hover:border-zen-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </motion.div>

        {/* Tip of the Day Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-md mx-auto"
        >
          <TipOfTheDay />
        </motion.div>
      </motion.div>

      {/* Footer accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zen-sage/20 via-zen-blue/20 to-zen-sage/20" />
    </div>
  );
}
