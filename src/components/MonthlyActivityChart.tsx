"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

type Activity = {
  activity_date: string;
  intensity: number;
};

interface Props {
  data: Activity[];
}

export default function MonthlyActivityChart({ data }: Props) {
  const monthlyMap: Record<string, number> = {};

  data.forEach((entry) => {
    if (!entry.activity_date) return;

    const dateObj = new Date(entry.activity_date);
    if (isNaN(dateObj.getTime())) return;

    const month = format(dateObj, "MMM yyyy");

    if (!monthlyMap[month]) {
      monthlyMap[month] = 0;
    }

    monthlyMap[month] += entry.intensity;
  });

  const formatted = Object.entries(monthlyMap)
    .map(([month, total]) => ({
      month,
      total,
    }))
    .sort(
      (a, b) =>
        new Date(a.month).getTime() -
        new Date(b.month).getTime()
    );

  if (formatted.length === 0) return null; // Prevent empty render bug

  const bestMonth = formatted.reduce((prev, curr) =>
    curr.total > prev.total ? curr : prev
  );

  let growthPercent = 0;

  if (formatted.length >= 2) {
    const last = formatted[formatted.length - 1].total;
    const prev = formatted[formatted.length - 2].total;

    if (prev !== 0) {
      growthPercent = ((last - prev) / prev) * 100;
    }
  }

  return (
    <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800 mt-12">
      <h3 className="text-white text-lg mb-4">
        Monthly Activity Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm">
        <div className="bg-[#0e1621] p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400">Most Productive Month</p>
          <p className="text-green-400 font-bold text-lg">
            {bestMonth.month}
          </p>
          <p className="text-gray-500 text-xs">
            {bestMonth.total} contributions
          </p>
        </div>

        <div className="bg-[#0e1621] p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400">Monthly Growth</p>
          <p
            className={`font-bold text-lg ${
              growthPercent >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {growthPercent.toFixed(1)}%
          </p>
        </div>

        <div className="bg-[#0e1621] p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400">Active Months</p>
          <p className="text-white font-bold text-lg">
            {formatted.length}
          </p>
        </div>
      </div>

      {/* Stable Container */}
      <div className="w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formatted}>
            <CartesianGrid stroke="#222" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}