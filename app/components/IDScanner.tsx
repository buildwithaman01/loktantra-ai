"use client";
import { useState, useRef } from "react";

export default function IDScanner({ onResult }: { onResult: (res: string) => void }): JSX.Element {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const img = new Image();
      img.onload = (): void => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        processImage(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string): Promise<void> => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      onResult(data.result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze document.";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-lg min-h-[180px] flex flex-col justify-center transition-all">
      <div className="space-y-4 text-center">
        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm transform -rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
        </div>
        
        <div>
          <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">ID Verification</h4>
          <p className="text-[10px] text-gray-400 mt-1">Aadhaar • Voter ID • PAN</p>
        </div>

        {error && (
          <p className="text-[10px] text-red-500 font-bold bg-red-50 py-2 rounded-xl px-2 animate-pulse">
            ⚠️ {error}
          </p>
        )}
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3
            ${isAnalyzing ? "bg-gray-100 text-gray-400 cursor-wait" : "bg-slate-900 text-white hover:bg-black"}`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ANALYZING DOCUMENT...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              UPLOAD YOUR ID CARD
            </>
          )}
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        
        <p className="text-[9px] text-gray-400 italic">
          Files are processed instantly and never stored.
        </p>
      </div>
    </div>
  );
}
