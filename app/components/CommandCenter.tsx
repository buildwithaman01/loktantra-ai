"use client";
import { useState } from "react";
import ChatAssistant from "./ChatAssistant";
import PollingRadar from "./PollingRadar";
import IDScanner from "./IDScanner";
import EligibilityWizard from "./EligibilityWizard";
import CivicTrends from "./CivicTrends";

interface UserProfile {
  age: string;
  state: string;
  voterStatus: string;
}

export default function CommandCenter({ profile }: { profile: UserProfile }): JSX.Element {
  const [activeTab, setActiveTab] = useState<"chat" | "map" | "tools">("chat");
  const [scanResult, setScanResult] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto px-0 md:px-4 md:py-6 bg-slate-50/30">
      {/* Mobile Tab Switcher */}
      <nav className="sticky top-[60px] z-30 glass-panel flex p-1.5 mx-4 mt-4 rounded-2xl shadow-lg md:hidden border border-white/50">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "chat" ? "gradient-bg text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-white/50"}`}
        >
          <span className="text-lg">💬</span> {activeTab === "chat" && "Chat"}
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "map" ? "gradient-bg text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-white/50"}`}
        >
          <span className="text-lg">🗺️</span> {activeTab === "map" && "Radar"}
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "tools" ? "gradient-bg text-white shadow-md scale-[1.02]" : "text-slate-500 hover:bg-white/50"}`}
        >
          <span className="text-lg">🛠️</span> {activeTab === "tools" && "Tools"}
        </button>
      </nav>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-12 gap-6 h-[800px]">
        {/* Main Area: Chat */}
        <section className="col-span-7 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
          <ChatAssistant userProfile={profile} />
        </section>

        {/* Sidebar: Map & Tools */}
        <aside className="col-span-5 flex flex-col gap-6 overflow-y-auto pr-2">
          <section className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 h-[400px]">
            <PollingRadar state={profile.state} />
          </section>
          
          <div className="space-y-6">
            <EligibilityWizard />
            <CivicTrends />
            <IDScanner onResult={(res) => setScanResult(res)} />
            {scanResult && (
              <div className="space-y-4 animate-fade-in-up">
                <div className={`p-5 rounded-2xl font-bold text-center border-2 shadow-sm ${scanResult.includes("VALID") ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"}`}>
                  <div className="text-xl mb-1">{scanResult.includes("VALID") ? "✅" : "⚠️"}</div>
                  {scanResult}
                </div>
                
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">Next Steps Guide</h4>
                  <p className="text-xs leading-relaxed opacity-90">
                    {scanResult.includes("VALID") 
                      ? "Your document is recognized! Ensure your name matches the official Electoral Roll at voters.eci.gov.in."
                      : "We couldn't recognize this as a valid voter ID. If you've lost your card, you can apply for a duplicate via Form 1."}
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href="https://voters.eci.gov.in/" 
                      target="_blank"
                      className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-[10px] font-bold text-center transition"
                    >
                      Official Portal
                    </a>
                    <button 
                      onClick={() => setScanResult(null)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-[10px] font-bold text-center transition"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Single-View Layout */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        {activeTab === "chat" && (
          <div className="h-full animate-fade-in-up">
            <ChatAssistant userProfile={profile} />
          </div>
        )}
        {activeTab === "map" && (
          <div className="h-full p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100 h-[500px]">
              <PollingRadar state={profile.state} />
            </div>
          </div>
        )}
        {activeTab === "tools" && (
          <div className="h-full p-4 space-y-6 overflow-y-auto animate-fade-in-up pb-24">
            <EligibilityWizard />
            <CivicTrends />
            <IDScanner onResult={(res) => setScanResult(res)} />
            {scanResult && (
              <div className="space-y-4 animate-fade-in-up">
                <div className={`p-5 rounded-2xl font-bold text-center border-2 shadow-sm ${scanResult.includes("VALID") ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"}`}>
                  <div className="text-xl mb-1">{scanResult.includes("VALID") ? "✅" : "⚠️"}</div>
                  {scanResult}
                </div>
                
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">Next Steps Guide</h4>
                  <p className="text-xs leading-relaxed opacity-90">
                    {scanResult.includes("VALID") 
                      ? "Your document is recognized! Ensure your name matches the official Electoral Roll at voters.eci.gov.in."
                      : "We couldn't recognize this as a valid voter ID. If you've lost your card, you can apply for a duplicate via Form 1."}
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href="https://voters.eci.gov.in/" 
                      target="_blank"
                      className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-[10px] font-bold text-center transition"
                    >
                      Official Portal
                    </a>
                    <button 
                      onClick={() => setScanResult(null)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 py-2 rounded-lg text-[10px] font-bold text-center transition"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
