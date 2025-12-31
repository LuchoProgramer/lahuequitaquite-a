"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const [isMajor, setIsMajor] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    if (isMajor) {
      router.push("/productos");
    } else {
      alert("Debes ser mayor de edad para ingresar.");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background-dark font-display antialiased selection:bg-primary selection:text-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background-dark/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent z-20"></div>
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-90 grayscale contrast-125 transition-transform duration-[20s] scale-110 motion-safe:animate-slow-zoom"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop")' }}
        ></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-30 flex h-full flex-col justify-between px-6 py-6 max-w-lg mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-end w-full">
          <Link href="/login" className="group flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 backdrop-blur-md transition-all hover:bg-primary/20">
            <span className="text-xs font-bold tracking-wider text-[#b9b29d] group-hover:text-primary">LOGIN</span>
            <span className="material-symbols-outlined text-[18px] text-[#b9b29d] group-hover:text-primary">login</span>
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center w-full mb-20">
          {/* Brand Logo/Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-background-dark/50 p-4 shadow-[0_0_30px_rgba(238,189,43,0.15)] backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[40px] text-primary">local_bar</span>
          </motion.div>

          {/* Headline Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold uppercase leading-tight tracking-[0.15em] text-white drop-shadow-lg drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              La Huequita<br /><span className="text-primary italic font-display lowercase tracking-normal">Quiteña</span>
            </h1>
            <div className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-[10px] font-light uppercase tracking-[0.4em] text-gray-400"
          >
            La excelencia en cada gota
          </motion.p>

          {/* Interactive Section */}
          <div className="mt-16 w-full space-y-6">
            {/* Age Verification Checklist */}
            <div className="flex items-center justify-center">
              <label className="group flex cursor-pointer items-center gap-x-3 rounded-lg p-3 transition-colors hover:bg-white/5 border border-transparent hover:border-white/5">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isMajor}
                    onChange={(e) => setIsMajor(e.target.checked)}
                    className="custom-checkbox h-5 w-5 appearance-none rounded border-2 border-[#544d3b] bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-0 transition-all cursor-pointer"
                  />
                  {isMajor && <span className="material-symbols-outlined absolute text-black text-xs font-black pointer-events-none">check</span>}
                </div>
                <span className="select-none text-xs font-medium uppercase tracking-widest text-gray-400 group-hover:text-white lux-transition">Soy mayor de edad (+18)</span>
              </label>
            </div>

            {/* Primary CTA Button */}
            <button
              onClick={handleEnter}
              disabled={!isMajor}
              className="group relative w-full overflow-hidden rounded-lg bg-primary py-5 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(238,189,43,0.3)]"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-background-dark">Explorar Colección</span>
                <span className="material-symbols-outlined text-background-dark transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </button>

            {/* Footer Link */}
            <div className="text-center pt-4">
              <Link className="text-[9px] font-medium uppercase tracking-[0.3em] text-gray-500 hover:text-primary transition-colors" href="/terminos">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Safe Area */}
        <div className="text-[8px] text-center text-gray-600 uppercase tracking-widest opacity-40">
          Beber con moderación. Prohibida la venta a menores de 18 años.
        </div>
      </div>
    </div>
  );
}
