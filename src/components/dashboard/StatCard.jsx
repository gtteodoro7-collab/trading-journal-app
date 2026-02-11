import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default"
}) {

  const colors = {
    success: "border-green-500/30 bg-green-500/5 text-green-400",
    danger: "border-red-500/30 bg-red-500/5 text-red-400",
    warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
    info: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    default: "border-white/10 bg-white/5 text-white"
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur ${colors[variant]}`}>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs opacity-70">{title}</p>
          <h3 className="text-xl font-semibold mt-1">{value}</h3>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <Icon size={20} className="opacity-70" />
        )}
      </div>

    </div>
  );
}
