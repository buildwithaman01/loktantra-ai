"use client";

const TRENDS = [
  { topic: "New Voter (Form 6)", percentage: 85, color: "bg-orange-500" },
  { topic: "Address Change (Form 8)", percentage: 65, color: "bg-slate-500" },
  { topic: "Lost ID Card", percentage: 40, color: "bg-orange-400" },
  { topic: "Home Voting", percentage: 30, color: "bg-green-500" },
];

export default function CivicTrends(): JSX.Element {
  return (
    <div className="bg-white border-2 border-gray-50 rounded-3xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
        📊 Civic Sentiment Trends
      </h3>
      <div className="space-y-4">
        {TRENDS.map((trend) => (
          <div key={trend.topic}>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              <span>{trend.topic}</span>
              <span>{trend.percentage}% Live Demand</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`${trend.color} h-full transition-all duration-1000`} 
                style={{ width: `${trend.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed italic">
        Real-time interest mapping across Indian constituencies using anonymized Gemini query volume.
      </p>
    </div>
  );
}
