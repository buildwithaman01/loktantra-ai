interface FormData {
  recommendedForm: string;
  steps: string[];
  documents: string[];
  deadline?: string;
}

export default function FormRenderer({ data }: { data: FormData }): JSX.Element {
  const handlePrint = () => {
    window.print();
  };

  return (
    <article
      aria-label={`Election form: ${data.recommendedForm}`}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-fade-in-up print:border-none print:shadow-none"
    >
      <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center print:bg-white">
        <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2">
          📄 Official Guide
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="text-[10px] bg-white border border-orange-200 text-orange-600 font-bold px-2 py-1 rounded hover:bg-orange-50 transition print:hidden"
          >
            PRINT CHECKLIST
          </button>
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
            {data.recommendedForm}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ... rest of the component content ... */}
        <section aria-label="Steps to complete">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Next Steps</h4>
          <ol className="space-y-3">
            {data.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-[10px]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Required documents">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Documents Required</h4>
          <div className="flex flex-wrap gap-2">
            {data.documents.map((doc, i) => (
              <span key={i} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600">
                📎 {doc}
              </span>
            ))}
          </div>
        </section>

        {data.deadline && (
          <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-orange-600 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Deadline: {data.deadline}
          </div>
        )}
      </div>
    </article>
  );
}
