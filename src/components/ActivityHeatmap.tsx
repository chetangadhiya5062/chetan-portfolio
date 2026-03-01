"use client";

import { useEffect, useState } from "react";
import { eachDayOfInterval, subDays, format } from "date-fns";

type Activity = {
  activity_date: string;
  intensity: number;
};

export default function ActivityHeatmap() {
  const [data, setData] = useState<Activity[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Safe fetchData
  async function fetchData() {
    try {
      const res = await fetch("/api/activity");
      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error("Activity API returned non-array:", json);
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      setData([]);
    }
  }

  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 180),
    end: today,
  });

  // ✅ Safety-fixed getIntensity
  function getIntensity(date: Date) {
    if (!Array.isArray(data)) return 0;

    const formatted = format(date, "yyyy-MM-dd");

    const record = data.find(
      (d: any) =>
        d?.activity_date?.startsWith(formatted)
    );

    return record?.intensity || 0;
  }

  function getColor(intensity: number) {
    if (intensity === 0) return "bg-gray-800";
    if (intensity < 3) return "bg-green-400";
    if (intensity < 6) return "bg-green-600";
    return "bg-green-800";
  }

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-10">
        🧬 Digital Activity Genome
      </h2>

      <div className="grid grid-cols-18 gap-1">
        {days.map((day) => {
          const intensity = getIntensity(day);
          return (
            <div
              key={day.toISOString()}
              className={`w-4 h-4 rounded ${getColor(intensity)}`}
              title={`${format(day, "yyyy-MM-dd")} : ${intensity}`}
            />
          );
        })}
      </div>
    </section>
  );
}