# 🗳️ Loktantra AI — Personalized Civic Command Center

<p align="center">
  <img src="public/icon-512.png" width="128" height="128" alt="Loktantra AI Logo" />
</p>

> Transforming India's complex election process into a dynamic, accessible, 
> multilingual civic assistant — one situation at a time.

**Built for:** PromptWars Virtual | Challenge 2: Election Process Education  
**Host:** Hack2Skill × Google for Developers  
**Live Demo:** [https://loktantra-ai-121988453399.asia-south1.run.app/](https://loktantra-ai-121988453399.asia-south1.run.app/)  
**App Type:** Installable Progressive Web App (PWA)

---

## The Problem
First-time voters in Tier 2/3 cities and rural areas face three critical barriers:
1. Complex, jargon-heavy Election Commission documentation
2. No personalized, vernacular guidance for their specific situation
3. Inaccessible information for users with visual or cognitive disabilities

## The Solution
Loktantra AI is a dynamic civic engine that takes three inputs from the user (age, 
state, voter situation) and routes them to their exact scenario using Gemini's 
structured JSON output. It renders the precise Election Commission form required, 
locates nearby polling booths, and communicates in the user's native language.

---

## 🚀 Key Features

- **Gemini 2.5 Flash + Vision API:** Integrated ID Scanner for real-time verification of Voter ID, Aadhaar, and PAN cards using computer vision.
- **Multi-Model Cascade & Resilience:** Advanced fallback engine that cycles between `gemini-2.5-flash` and `gemini-1.5-flash` across multiple API keys for 99.9% uptime.
- **Streaming Conversational UI:** Word-by-word streaming responses for an ultra-fast, "living" interface.
- **Installable PWA:** Full Progressive Web App support with offline caching, high-resolution icons, and native app behavior.
- **Civic Sentiment Analytics:** Real-time demand mapping for election forms using anonymized AI query trends.
- **Hyperlocal Polling Radar:** Precise polling booth location finder powered by Google Maps Places API.
- **Vernacular Audio Transcription:** Multi-language voice-to-text support for Hindi, Bengali, and English queries.
- **Accessibility Engine:** One-tap toggles for high-contrast mode, Dyslexia-friendly typography, and full ARIA keyboard navigation.

---

## Architecture & Approach

**Framework:** Next.js 14 (App Router) with TypeScript strict mode  
**AI Engine:** Google Gemini 2.5 Flash via `@google/generative-ai`  
**PWA:** `sw.js` for offline caching + `manifest.json` for native feel  
**Validation:** Zod schemas on all inputs AND all Gemini outputs  
**Styling:** Tailwind CSS with premium gradients and mobile-first tabbed UI  
**Deployment:** Dockerized (multi-stage) → Google Cloud Run  

### Key Architectural Decisions

**Streaming Conversational UI:** We separate the AI response into a conversational reply (streamed first) and a structured JSON block (rendered as a card at the end). This maximizes perceived speed and user trust.

**Security:** Strict CSP headers via `middleware.ts`. All AI outputs sanitized through `isomorphic-dompurify`. API keys stored in Google Secret Manager.

**Efficiency:** PWA service worker caches static assets for instant load. `next/dynamic` imports for heavy components like Maps. Client-side translation cache minimizes redundant API calls.

---

## Google Services Used

| Service | Purpose |
|---|---|
| **Gemini 2.5 Flash API** | Core Intelligence — Streaming responses + structured routing |
| **Gemini 1.5 Flash (Vision)** | Computer Vision — Identity document analysis & verification |
| **Cloud Translation API** | Vernacular Support — UI & Response translation (EN/HI/BN) |
| **Maps Places API** | Geolocation — Hyperlocal polling booth discovery |
| **Google Cloud Run** | Infrastructure — High-performance containerized hosting |
| **Artifact Registry** | DevOps — Secure container image management |
| **Secret Manager** | Security — Hardened storage for production API keys |

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/buildwithaman01/loktantra-ai.git
cd loktantra-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys (GEMINI_API_KEY, GOOGLE_MAPS_API_KEY, etc.)

# Run development server
npm run dev
# Open http://localhost:3000
```

---

*Built with Gemini API*  
*#BuildwithAI #PromptWarsVirtual #ElectionTech*
