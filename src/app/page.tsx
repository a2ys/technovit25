"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative overflow-hidden bg-black selection:bg-[#70E081] selection:text-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] md:h-[500px] bg-[#70E081] rounded-full blur-[120px] md:blur-[180px] opacity-20 pointer-events-none animate-pulse" />

      <div className="relative z-10 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight"
        >
          <span className="text-white">techno</span>
          <span className="text-[#70E081]">VIT</span>
          <span className="text-white">&apos;25</span>
          <span className="mt-2 text-white"> is over</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
          className="h-1 w-24 md:w-32 bg-[#70E081] mx-auto rounded-full"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg md:text-3xl text-zinc-400 font-medium tracking-wide uppercase"
        >
          We&apos;ll meet again in{" "}
          <span className="text-white font-bold">2026</span>!
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-3 w-full"
      >
        {/* Links */}
        <div className="flex items-center gap-4 text-xs md:text-sm tracking-widest uppercase font-medium text-zinc-500">
          <Link
            href="https://github.com/a2ys/technovit25"
            target="_blank"
            className="hover:text-[#70E081] transition-colors duration-300"
          >
            Source Code
          </Link>
          <span className="text-zinc-800">|</span>
          <Link
            href="https://chennai.vit.ac.in"
            target="_blank"
            className="hover:text-[#70E081] transition-colors duration-300"
          >
            Visit VIT Chennai
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
