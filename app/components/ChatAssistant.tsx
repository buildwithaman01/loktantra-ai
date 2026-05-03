"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import FormRenderer from "./FormRenderer";
import { useAppStore } from "@/lib/store";

interface ElectionFormData {
  scenario?: string;
  recommendedForm: string;
  steps: string[];
  documents: string[];
  deadline?: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  formData?: ElectionFormData;
}

interface UserProfile {
  age: string;
  state: string;
  voterStatus: string;
}

export default function ChatAssistant({ userProfile }: { userProfile: UserProfile }): JSX.Element {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "ai",
      text: `Hello! I see you are a ${userProfile.age}-year-old from ${userProfile.state} dealing with: ${userProfile.voterStatus}. How can I help you with your election process today?`,
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecordingFallback = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("⚠️ Browser Security Block: navigator.mediaDevices is undefined. This usually happens on insecure connections.");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          handleAudioSubmit(base64Audio);
        };
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setError(null);
      
      setTimeout(() => { if (recorder.state === "recording") recorder.stop(); setIsRecording(false); }, 8000);
    } catch (err) {
      const errorName = (err as any)?.name || "Unknown";
      const errorMessage = (err as any)?.message || "Check hardware";
      console.error("DEBUG MIC ERROR:", errorName, errorMessage);
      if (errorName === "NotAllowedError") {
        setError("⚠️ Permission Denied: Chrome is blocked. Click the 'Lock' icon and 'Reset Permission'.");
      } else if (errorName === "NotFoundError") {
        setError("⚠️ No Microphone Found: Please plug in a microphone.");
      } else if (errorName === "NotReadableError" || errorName === "TrackStartError") {
        setError("⚠️ Hardware Busy: Another app (Zoom/Teams) is using your mic.");
      } else {
        setError(`⚠️ System Error (${errorName}): ${errorMessage}`);
      }
    }
  };

  const toggleListening = async () => {
    console.log("[LOKTANTRA] Voice button triggered - trying Standard API");
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) {
        startRecordingFallback();
        return;
      }

      if (isListening || isRecording) {
        setIsListening(false);
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : language === "bn" ? "bn-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech API Error:", event?.error);
        if (event?.error === "not-allowed") {
          console.log("Switching to MediaRecorder Fallback...");
          startRecordingFallback();
        } else {
          setError(`⚠️ Speech Error: ${event?.error || "unknown"}`);
        }
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event?.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          setTimeout(() => handleSubmit(transcript), 600);
        }
      };

      recognition.start();
    } catch {
      startRecordingFallback();
    }
  };

  const handleAudioSubmit = async (base64Audio: string) => {
    setIsLoading(true);
    try {
      // We'll use a new vision/audio-capable endpoint
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Audio, type: "audio" }),
      });
      const data = await res.json();
      if (data.result) {
        handleSubmit(data.result);
      }
    } catch {
      setError("Failed to process audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (overrideInput?: string): Promise<void> => {
    const textToSubmit = overrideInput || input;
    if (!textToSubmit.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: textToSubmit.trim(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, language, userProfile }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch response");
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullText = "";
      
      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        const [displayText, jsonPart] = fullText.split("###FORM_DATA###");
        
        setMessages((prev) => prev.map(m => {
          if (m.id === aiMessageId) {
            let formData: ElectionFormData | undefined = undefined;
            if (jsonPart) {
              try {
                const cleanedJson = jsonPart.trim().replace(/```json|```/g, "");
                formData = JSON.parse(cleanedJson);
              } catch { }
            }
            return { ...m, text: displayText.trim(), formData };
          }
          return m;
        }));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, idx) => (
          <article 
            key={msg.id} 
            className={`flex items-start gap-2 md:gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} entrance-stagger`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm
              ${msg.role === "user" ? "bg-orange-100 text-orange-600" : "bg-slate-900 text-white"}`}
            >
              {msg.role === "user" ? "ME" : "AI"}
            </div>
 
            <div className={`max-w-[88%] md:max-w-[80%] group`}>
              <div className={`rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base leading-relaxed
                ${msg.role === "user" 
                  ? "chat-bubble-user text-white rounded-tr-none" 
                  : "chat-bubble-ai text-gray-800 border border-slate-100 rounded-tl-none"}`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              
              {msg.formData && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100 shadow-sm bg-white">
                  <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-orange-600">Action Required</span>
                  </div>
                  <FormRenderer data={msg.formData} />
                </div>
              )}
            </div>
          </article>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 flex-row animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200" />
            <div className="max-w-[60%] w-full">
              <div className="h-20 w-full rounded-2xl rounded-tl-none skeleton-shimmer" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center mx-auto max-w-sm" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all shadow-md active:scale-90 relative z-10
              ${isListening 
                ? "bg-red-500 text-white ring-4 ring-red-100" 
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
          >
            {isListening ? (
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            )}
          </button>

          <div className="flex-1 flex gap-2 p-1 md:p-1.5 bg-slate-50/50 rounded-2xl border border-slate-200 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 transition-all shadow-inner">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={isListening ? (language === "hi" ? "सुन रहा हूँ..." : "Listening...") : (language === "hi" ? "अपना सवाल पूछें..." : "Ask a question...")}
              className="flex-1 bg-transparent px-3 py-2 md:px-4 md:py-3 focus:outline-none text-sm md:text-base text-slate-800 placeholder-slate-400"
            />
            <button 
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="gradient-bg text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl shadow-md hover:shadow-lg disabled:opacity-30 transition-all active:scale-95 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
