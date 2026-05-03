import OnboardingForm from "./components/OnboardingForm";

export default function HomePage(): JSX.Element {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-4 shadow-sm">
      <section aria-label="Get started" className="container mx-auto px-4 py-8">
        <OnboardingForm />
      </section>
    </div>
  );
}
