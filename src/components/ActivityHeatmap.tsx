"use client";

import { useEffect, useState } from "react";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  getMonth,
} from "date-fns";

import PlatformPieChart from "./PlatformPieChart";
import MonthlyActivityChart from "./MonthlyActivityChart";
import CountUp from "react-countup";

type Activity = {
  activity_date: string;
  intensity: number;
};

export default function ActivityHeatmap() {
  const [data, setData] = useState<Activity[]>([]);
  const [platformStats, setPlatformStats] = useState<any>({});
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const totalPlatformContributions = Object.values(platformStats)
    .reduce((sum: number, val: any) => sum + val, 0);

  useEffect(() => {
    fetchData();

    fetch("/api/stats/platform")
      .then((res) => res.json())
      .then((data) => setPlatformStats(data));
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/activity");
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch {}
  }

  // 🔥 Dynamically extract available years
  const availableYears = Array.from(
    new Set(
      data.map((d) =>
        new Date(d.activity_date).getFullYear()
      )
    )
  ).sort((a, b) => b - a);

  // 🔥 Filter data based on selected year
  const filteredData =
    data.filter(
      (d) =>
        new Date(d.activity_date).getFullYear() ===
        selectedYear
    );

  // ✅ Replace All data References with filteredData
  const activeYear = selectedYear || new Date().getFullYear();
  const startDateBound = new Date(activeYear, 0, 1);
  const endDateBound = new Date(activeYear, 11, 31);
  
  // Ensure the grid starts at the beginning of the week for the selected year
  const calendarStart = startOfWeek(startDateBound, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: endDateBound,
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

  // 📈 Monthly Growth Calculation
  const monthlyMap: Record<string, number> = {};

  data.forEach((entry) => {
    if (!entry.activity_date) return;
    const dateObj = new Date(entry.activity_date);
    if (isNaN(dateObj.getTime())) return;
    const month = format(dateObj, "yyyy-MM");
    if (!monthlyMap[month]) monthlyMap[month] = 0;
    monthlyMap[month] += entry.intensity;
  });

  const monthlyValues = Object.values(monthlyMap);
  let growthPercent = 0;
  if (monthlyValues.length >= 2) {
    const last = monthlyValues[monthlyValues.length - 1];
    const prev = monthlyValues[monthlyValues.length - 2];
    if (prev !== 0) {
      growthPercent = ((last - prev) / prev) * 100;
    }
  }

  const consistencyScore = ((activeDays / 365) * 100).toFixed(1);

  let badge = "Inactive";
  if (Number(consistencyScore) >= 75) badge = "Elite Developer";
  else if (Number(consistencyScore) >= 50) badge = "Highly Consistent";
  else if (Number(consistencyScore) >= 25) badge = "Active Contributor";
  else if (Number(consistencyScore) >= 10) badge = "Emerging Developer";

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-2">
        🧬 Digital Activity Genome
      </h2>

      {/* ✅ Add Year Dropdown UI */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <p className="text-gray-400 text-sm">
          Contribution activity for selected year
        </p>

        <select
          value={selectedYear ?? ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#161b22] border border-gray-800 text-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:border-green-500"
        >
          {[...new Set(data.map((d) => new Date(d.activity_date).getFullYear()))]
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>

      {/* 🔥 Platform Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(platformStats).map(
          ([platform, value]: any) => {
            const percentage = totalPlatformContributions
              ? ((value / totalPlatformContributions) * 100).toFixed(1)
              : 0;

            return (
              <div
                key={platform}
                className="bg-[#161b22] p-6 rounded-xl border border-gray-800"
              >
                <p className="text-gray-400 capitalize mb-2">
                  {platform}
                </p>
                <p className="text-2xl font-bold text-white">
                  {value}
                </p>
                <div className="w-full bg-gray-800 h-2 rounded mt-3">
                  <div
                    className="h-2 rounded bg-green-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {percentage}% of total activity
                </p>
              </div>
            );
          }
        )}
      </div>

      <div className="mt-10">
        <PlatformPieChart data={platformStats} />
      </div>

      <div className="mt-8 bg-[#0e1621] p-6 rounded-xl border border-gray-800">
        <p className="text-gray-400 mb-2">
          Developer Activity Index
        </p>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-3xl font-bold text-green-400">
              <CountUp
                end={totalPlatformContributions}
                duration={1.5}
              />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Composite cross-platform score
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Consistency Score
            </p>
            <p className="text-xl font-semibold text-white">
              <CountUp
                end={Number(consistencyScore)}
                decimals={1}
                duration={1.5}
              />%
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Monthly Trend
            </p>
            <p
              className={`text-lg font-bold ${
                growthPercent > 0
                  ? "text-green-400"
                  : growthPercent < 0
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {growthPercent > 0 && "↑ "}
              {growthPercent < 0 && "↓ "}
              {growthPercent.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Developer Badge
            </p>
            <p className="text-lg font-bold text-yellow-400">
              {badge}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
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
            <CountUp end={currentStreak} duration={1.2} /> days
          </p>
        </div>
        <div>
          <p className="text-gray-400">Longest Streak</p>
          <p className="text-xl font-semibold text-green-500">
            <CountUp end={longestStreak} duration={1.2} /> days
          </p>
        </div>
      </div>

      <MonthlyActivityChart data={data} />

      {/* ===== Heatmap Section ===== */}
      <div className="mt-12">
        {/* Render year selector */}
        <div className="flex gap-3 mb-6">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedYear === year
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="flex flex-col min-w-max">
            {/* Month Labels */}
            <div className="flex gap-1 ml-8 mb-2 text-xs text-gray-500">
              {monthLabels.map((label, i) => (
                <div key={i} style={{ width: 14 }}>
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <div style={{ height: 14 }}></div>
                <div style={{ height: 14 }}>Mon</div>
                <div style={{ height: 14 }}></div>
                <div style={{ height: 14 }}>Wed</div>
                <div style={{ height: 14 }}></div>
                <div style={{ height: 14 }}>Fri</div>
                <div style={{ height: 14 }}></div>
              </div>

              {/* Heatmap Grid */}
              <div className="flex gap-1">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {week.map((day) => {
                      const intensity = getIntensity(day);
                      const isSameYear = day.getFullYear() === selectedYear;
                      
                      return (
                        <div
                          key={day.toISOString()}
                          title={`${format(day, "yyyy-MM-dd")} • ${intensity} contributions`}
                          style={{
                            width: 14,
                            height: 14,
                            backgroundColor: isSameYear ? getColor(intensity) : "transparent",
                            borderRadius: 2,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
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
      </div>
    </section>
  );
}