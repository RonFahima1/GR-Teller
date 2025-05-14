"use client";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  accentColor?: string;
}

export function DashboardCard({ icon, label, value, accentColor = "#2563eb" }: DashboardCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 800;
      const step = Math.ceil(value / (duration / 16));
      const interval = setInterval(() => {
        start += step;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(start);
        }
      }, 16);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex flex-col items-start justify-between min-w-[160px] h-[110px] p-5 rounded-2xl bg-white/60 dark:bg-[#18181b]/60 backdrop-blur-xl shadow-xl border border-white/30 dark:border-white/10 transition-all duration-200",
        "hover:ring-2 hover:ring-blue-200/60"
      )}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.7) 60%, rgba(37,99,235,0.08) 100%)",
      }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${accentColor}22 60%, ${accentColor}11 100%)`,
        }}
      >
        {icon}
      </div>
      <div className="mt-4">
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? Number(displayValue).toLocaleString() : displayValue}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-300 font-medium">{label}</div>
      </div>
    </motion.div>
  );
} 