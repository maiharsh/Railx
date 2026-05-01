"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

function Nav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/75 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {}
        <Link href="/" className="text-white font-semibold text-[17px] tracking-tight">
          Rail<span className="text-white/35">X</span>
        </Link>

        {}
        <div className="flex items-center gap-2">

          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-full text-[13px] text-white/45 hover:text-white/80 transition-colors duration-200"
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/88 transition-all duration-200"
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/88 transition-all duration-200"
              >
                Dashboard
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.025] blur-[100px] pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
      >

        {}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="text-[clamp(2.6rem,7vw,5rem)] font-bold tracking-tight text-white leading-[1.06] mb-5"
        >
          Travel smarter
          <br />
          <span className="text-white/25">by railx.</span>
        </motion.h1>

        {}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="text-[15px] text-white/38 max-w-[380px] leading-relaxed mb-10"
        >
          Book train tickets across India in seconds.
        </motion.p>

        {}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link href={isAuthenticated ? "/search" : "/register"}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all duration-200"
            >
              Start booking
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Nav isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
}