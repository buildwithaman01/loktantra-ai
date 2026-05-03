"use client";
import { useState } from "react";

export default function EligibilityWizard(): JSX.Element {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ age: 0, disabled: false });

  const reset = (): void => {
    setStep(1);
    setAnswers({ age: 0, disabled: false });
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          🏠 Home Voting Checker
        </h3>
        <span className="bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-1 rounded">FORM 12D</span>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in-up">
          <p className="text-sm text-gray-600">Step 1: What is your current age?</p>
          <div className="grid grid-cols-2 gap-3">
            {[18, 45, 85, 90].map((age: number) => (
              <button 
                key={age}
                onClick={() => { setAnswers({ ...answers, age }); setStep(2); }}
                className="py-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-orange-200 transition"
              >
                {age === 18 ? "Below 85" : age === 45 ? "Around 45" : age === 85 ? "85+" : "90+"}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in-up">
          <p className="text-sm text-gray-600">Step 2: Do you have a disability of 40% or more?</p>
          <div className="flex gap-3">
            <button 
              onClick={() => { setAnswers({ ...answers, disabled: true }); setStep(3); }}
              className="flex-1 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-orange-200"
            >
              YES
            </button>
            <button 
              onClick={() => { setAnswers({ ...answers, disabled: false }); setStep(3); }}
              className="flex-1 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-orange-200"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in-up">
          {(answers.age >= 85 || answers.disabled) ? (
            <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl text-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-black text-green-800">You are ELIGIBLE!</h4>
              <p className="text-xs text-green-700 mt-1">You can request a postal ballot at your doorstep using Form 12D.</p>
              <a 
                href="https://voters.eci.gov.in/" 
                target="_blank" 
                className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-xs font-bold"
              >
                Download Form 12D
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <h4 className="font-black text-gray-800">Standard Voting</h4>
              <p className="text-xs text-gray-600 mt-1">You must visit the polling booth. Home voting is reserved for elderly (85+) and PwD (40%+) voters.</p>
            </div>
          )}
          <button 
            onClick={reset}
            className="w-full text-xs font-bold text-gray-400 hover:text-slate-900 transition"
          >
            Check Again
          </button>
        </div>
      )}
    </div>
  );
}
