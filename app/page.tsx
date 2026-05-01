import OnboardingForm from "@/app/components/OnboardingForm";
import AccessibilityBar from "@/app/components/AccessibilityBar";

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <header className="bg-white shadow-sm p-4">
        <nav aria-label="Main navigation">
          <h1 className="text-2xl font-bold text-orange-600">
            🗳️ Loktantra AI
          </h1>
          <p className="text-sm text-gray-600">
            Your Personalized Civic Command Center
          </p>
        </nav>
        <AccessibilityBar />
      </header>
      <section aria-label="Get started" className="container mx-auto px-4 py-8">
        <OnboardingForm />
      </section>
    </div>
  );
}
