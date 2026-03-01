"use client";

import { useEffect, useState } from "react";
import {
  format,
  subYears,
  eachDayOfInterval,
  startOfWeek,
  getMonth,
} from "date-fns";

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
      if (Array.isArray(json)) setData(json);
    } catch {}
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
    const record = data.find((d) =>
      d.activity_date?.startsWith(formatted)
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

  const monthLabels = weeks.map((week, i) => {
    const firstDay = week[0];
    const month = getMonth(firstDay);
    const prevMonth =
      i > 0 ? getMonth(weeks[i - 1][0]) : -1;

    return month !== prevMonth
      ? format(firstDay, "MMM")
      : "";
  });

  const totalContributions = data.reduce(
    (sum, d) => sum + d.intensity,
    0
  );

  // ===== STREAK CALCULATION =====
  const sortedData = [...data]
    .filter((d) => d.intensity > 0)
    .sort(
      (a, b) =>
        new Date(a.activity_date).getTime() -
        new Date(b.activity_date).getTime()
    );

  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedData.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedData[i - 1].activity_date);
      const curr = new Date(sortedData[i].activity_date);

      const diff =
        (curr.getTime() - prev.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  if (sortedData.length > 0) {
    currentStreak = 1;

    for (let i = sortedData.length - 1; i > 0; i--) {
      const curr = new Date(sortedData[i].activity_date);
      const prev = new Date(sortedData[i - 1].activity_date);

      const diff =
        (curr.getTime() - prev.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const activeDays = sortedData.length;

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-2">
        🧬 Digital Activity Genome
      </h2>

      {/* ✅ Updated Stats UI */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <p className="text-gray-400">Total Contributions</p>
          <p className="text-xl font-semibold text-white">
            {totalContributions}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Active Days</p>
          <p className="text-xl font-semibold text-white">
            {activeDays}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Current Streak</p>
          <p className="text-xl font-semibold text-green-400">
            {currentStreak} days
          </p>
        </div>

        <div>
          <p className="text-gray-400">Longest Streak</p>
          <p className="text-xl font-semibold text-green-500">
            {longestStreak} days
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">

          <div className="flex gap-1 ml-8 mb-2 text-xs text-gray-500">
            {monthLabels.map((label, i) => (
              <div key={i} style={{ width: 14 }}>
                {label}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <div style={{ height: 14 }}></div>
              <div style={{ height: 14 }}>Mon</div>
              <div style={{ height: 14 }}></div>
              <div style={{ height: 14 }}>Wed</div>
              <div style={{ height: 14 }}></div>
              <div style={{ height: 14 }}>Fri</div>
              <div style={{ height: 14 }}></div>
            </div>

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

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 3, 6, 10].map((lvl, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: getColor(lvl),
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>

        </div>
      </div>
    </section>
  );
}