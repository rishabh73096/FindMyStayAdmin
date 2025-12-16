import React from "react";
import { Settings as SettingsIcon, Clock } from "lucide-react";

function Settings() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white border border-orange-200 rounded-2xl shadow-md p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 text-orange-500 p-4 rounded-full">
            <SettingsIcon size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Settings
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-6">
          This feature is currently under development
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
          <Clock size={16} />
          Coming Soon
        </div>
      </div>
    </div>
  );
}

export default Settings;
