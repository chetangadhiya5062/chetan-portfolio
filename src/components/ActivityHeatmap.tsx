"use client";

import { useEffect, useState } from "react";
import { format, subYears, eachDayOfInterval, startOfWeek } from "date-fns";

type Activity = {
  activity_date: string;
  intensity: number;
};

export default function ActivityHeatmap() {
  const [data, setData] = useState<Activity[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/activity");
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    }
  }

  const today = new Date();
  const oneYearAgo = subYears(today, 1);

  const startDate = startOfWeek(oneYearAgo, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  function getIntensity(date: Date) {
    const formatted = format(date, "yyyy-MM-dd");
    const record = data.find(
      (d) => d.activity_date?.startsWith(formatted)
    );
    return record?.intensity || 0;
  }

  function getColor(intensity: number) {
    if (intensity === 0) return "#161b22";
    if (intensity < 2) return "#0e4429";
    if (intensity < 5) return "#006d32";
    if (intensity < 10) return "#26a641";
    return "#39d353";
  }

  const weeks: Date[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const totalContributions = data.reduce(
    (sum, d) => sum + d.intensity,
    0
  );

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-4">
        🧬 Digital Activity Genome
      </h2>

      <p className="text-gray-400 mb-8">
        {totalContributions} contributions in the last year
      </p>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((day) => {
                const intensity = getIntensity(day);
                return (
                  <div
                    key={day.toISOString()}
                    title={`${format(
                      day,
                      "yyyy-MM-dd"
                    )} • ${intensity} contributions`}
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: getColor(intensity),
                      borderRadius: 2,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}