import React from "react";

export default function AgencyBranding() {
  const agencyName = localStorage.getItem("agency_name") || "Triponic B2B";
  const agencyPlan = localStorage.getItem("agency_plan") || "Free Tier";

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-semibold text-lg">
          {agencyName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <h1 className="font-semibold text-slate-900 text-sm">{agencyName}</h1>
        <p className="text-xs text-slate-500">{agencyPlan}</p>
      </div>
    </div>
  );
}
