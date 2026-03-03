"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

interface Props {
  data: Record<string, number>;
}

export default function PlatformPieChart({
  data,
}: Props) {
  const formatted = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  if (formatted.length === 0) return null;

  return (
    <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800">
      <h3 className="text-white text-lg mb-4">
        Platform Distribution
      </h3>

      {/* Stable Container */}
      <div className="w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formatted}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {formatted.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}