"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import LanguageToggle from "./LanguageToggle";
import AccessibilityBar from "./AccessibilityBar";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/translate";

export default function Header(): JSX.Element {
  const { language } = useAppStore();
  const [title, setTitle] = useState("Loktantra AI");

  useEffect(() => {
    const updateTitle = async (): Promise<void> => {
      if (language === "en") {
        setTitle("Loktantra AI");
        return;
      }
      const translated = await translate("Loktantra AI", language);
      setTitle(translated);
    };
    updateTitle();
  }, [language]);

  return (
    <header className="sticky top-0 z-40 navy-gradient text-white shadow-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-2 md:py-3 flex justify-between items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 group">
          <div className="bg-white p-1 md:p-1.5 rounded-xl shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
            <Image 
              src="/icon-192.png" 
              alt="Logo" 
              width={28} 
              height={28} 
              className="rounded-lg md:w-9 md:h-9"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-saffron-300 to-orange-400 animate-shimmer" style={{ backgroundSize: '200% auto' }}>
              {title}
            </h1>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/50 font-bold -mt-0.5 hidden sm:block">
              Your Civic Intelligence Hub
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-4 overflow-x-auto no-scrollbar">
          <LanguageToggle />
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <AccessibilityBar />
        </div>
      </div>
    </header>
  );
}
