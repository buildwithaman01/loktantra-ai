"use client";
import { useState, useEffect } from "react";
import CommandCenter from "./CommandCenter";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/translate";

interface UserProfile {
  age: string;
  state: string;
  voterStatus: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const VOTER_SITUATIONS = [
  { value: "never_voted", label: "First-time voter — never registered" },
  { value: "moved_city", label: "Moved to a new city / constituency" },
  { value: "lost_id", label: "Lost my Voter ID card" },
  { value: "want_info", label: "Just want to understand the process" },
];

const DEFAULT_LABELS = {
  heroTitle: "Your Civic Command Center",
  heroSub: "Empowering voters with AI-driven guidance",
  cardTitle: "Personalize your guide",
  ageLabel: "Age",
  stateLabel: "State",
  situationLabel: "Your current situation",
  buttonText: "Generate My Guide →",
  selectState: "Select State",
  footer: "Built with Google Gemini AI for Indian Citizen Education"
};

export default function OnboardingForm(): JSX.Element {
  const { language } = useAppStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ age: "", state: "", voterStatus: "" });
  
  // Translation state
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [translatedSituations, setTranslatedSituations] = useState(VOTER_SITUATIONS);

  useEffect(() => {
    const performTranslation = async () => {
      if (language === "en") {
        setLabels(DEFAULT_LABELS);
        setTranslatedSituations(VOTER_SITUATIONS);
        return;
      }

      const toTranslate = [
        DEFAULT_LABELS.heroTitle, DEFAULT_LABELS.heroSub, DEFAULT_LABELS.cardTitle, 
        DEFAULT_LABELS.ageLabel, DEFAULT_LABELS.stateLabel, DEFAULT_LABELS.situationLabel, 
        DEFAULT_LABELS.buttonText, DEFAULT_LABELS.selectState, DEFAULT_LABELS.footer,
        ...VOTER_SITUATIONS.map(s => s.label)
      ];

      const translated = await translate(toTranslate, language);
      
      if (Array.isArray(translated)) {
        setLabels({
          heroTitle: translated[0],
          heroSub: translated[1],
          cardTitle: translated[2],
          ageLabel: translated[3],
          stateLabel: translated[4],
          situationLabel: translated[5],
          buttonText: translated[6],
          selectState: translated[7],
          footer: translated[8]
        });
        setTranslatedSituations(VOTER_SITUATIONS.map((s, i) => ({
          ...s,
          label: translated[9 + i]
        })));
      }
    };

    performTranslation();
  }, [language]);

  const handleSubmit = (): void => {
    if (!form.age || !form.state || !form.voterStatus) return;
    setProfile(form as UserProfile);
  };

  if (profile) return <CommandCenter profile={profile} />;

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="w-full navy-gradient text-white py-8 md:py-12 px-4 mb-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-block bg-white p-2 md:p-3 rounded-2xl shadow-xl mb-4 md:mb-6 mx-auto">
            <Image 
              src="/icon-512.png" 
              alt="Loktantra AI Logo" 
              width={60} 
              height={60} 
              className="rounded-xl md:w-20 md:h-20"
            />
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-2 md:mb-3 tracking-tighter">
            {labels.heroTitle}
          </h2>
          <p className="text-orange-200 text-sm md:text-lg opacity-90">
            {labels.heroSub}
          </p>
        </div>
      </div>
 
      <section 
        aria-label="Voter profile setup" 
        className="max-w-xl mx-5 md:mx-auto bg-white/90 backdrop-blur-md px-6 py-8 md:p-10 rounded-[2.5rem] card-elevation mb-12 -mt-12 md:-mt-16 z-10 relative border border-white entrance-stagger"
      >
        <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 text-slate-800 text-center tracking-tight">
          {labels.cardTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-600 mb-2">{labels.ageLabel}</label>
            <input
              id="age"
              type="number"
              min="18"
              max="120"
              aria-label="Enter your age"
              aria-required="true"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition"
              placeholder="e.g. 22"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-gray-600 mb-2">{labels.stateLabel}</label>
            <select
              id="state"
              aria-label="Select your state"
              aria-required="true"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">{labels.selectState}</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-10">
          <fieldset>
            <legend className="block text-sm font-semibold text-gray-600 mb-4">{labels.situationLabel}</legend>
            <div className="grid grid-cols-1 gap-3">
              {translatedSituations.map((opt) => (
                <label 
                  key={opt.value} 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition
                    ${form.voterStatus === opt.value 
                      ? "border-orange-500 bg-orange-50" 
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="voterStatus"
                    value={opt.value}
                    checked={form.voterStatus === opt.value}
                    onChange={(e) => setForm({ ...form, voterStatus: e.target.value })}
                    aria-label={opt.label}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span className="text-sm md:text-base font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          onClick={handleSubmit}
          aria-label="Generate my personalized election guide"
          disabled={!form.age || !form.state || !form.voterStatus}
          className="w-full gradient-bg text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all active:scale-95"
        >
          {labels.buttonText}
        </button>
      </section>
      
      <footer className="text-center text-gray-400 text-xs pb-8">
        {labels.footer}
      </footer>
    </div>
  );
}
