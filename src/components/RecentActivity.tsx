"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

type Activity = {
  id: string;
  activity_date: string;
  platform: string;
  intensity: number;
  title?: string | null;
  url?: string | null;
  type?: string | null;
  description?: string | null;
};

function getPlatformStyles(platform: string) {
  switch (platform.toLowerCase()) {
    case "github":
      return "bg-gray-800 text-gray-300";
    case "leetcode":
      return "bg-yellow-900/40 text-yellow-400";
    case "linkedin":
      return "bg-blue-900/40 text-blue-400";
    case "codeforces":
      return "bg-purple-900/40 text-purple-400";
    case "medium":
      return "bg-green-900/40 text-green-400";
    default:
      return "bg-gray-800 text-gray-400";
  }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadRecent() {
      const res = await fetch("/api/activity/recent");
      const json = await res.json();
      if (Array.isArray(json)) {
        setActivities(json);
      }
      setLoading(false);
    }

    loadRecent();
  }, []);

  const platforms = useMemo(() => {
    const unique = Array.from(
      new Set(activities.map((a) => a.platform))
    );
    return ["all", ...unique];
  }, [activities]);

  const filtered = useMemo(() => {
    if (selectedPlatform === "all") return activities;
    return activities.filter(
      (a) => a.platform === selectedPlatform
    );
  }, [activities, selectedPlatform]);

  // 🔥 Show only 5 unless expanded
  const visible = showAll ? filtered : filtered.slice(0, 5);

  return (
    <section className="mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Recent Activity
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => {
              setSelectedPlatform(platform);
              setShowAll(false); // reset when filter changes
            }}
            className={`px-4 py-2 text-sm rounded-full capitalize transition-all
              ${
                selectedPlatform === platform
                  ? "bg-green-500 text-black font-semibold"
                  : "bg-[#161b22] text-gray-400 hover:bg-gray-700"
              }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-gray-400 text-sm">Loading...</p>
      )}

      <div className="relative border-l border-gray-800 pl-6 space-y-8">
        {visible.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
            className="relative"
          >
            <div className="absolute -left-[9px] top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0e1621]" />

            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                className="block bg-[#161b22] p-5 rounded-xl border border-gray-800 hover:border-green-500 transition-all"
              >
                <CardContent item={item} />
              </a>
            ) : (
              <div className="bg-[#161b22] p-5 rounded-xl border border-gray-800">
                <CardContent item={item} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 🔥 Toggle Button */}
      {filtered.length > 5 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-all"
          >
            {showAll ? "Show Less" : "View More"}
          </button>
        </div>
      )}
    </section>
  );
}

function CardContent({ item }: { item: Activity }) {
  return (
    <>
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <span
          className={`px-3 py-1 text-xs rounded-full capitalize ${getPlatformStyles(
            item.platform
          )}`}
        >
          {item.platform}
        </span>

        <span className="text-xs text-gray-400">
          {format(
            new Date(item.activity_date),
            "MMM dd, yyyy"
          )}
        </span>
      </div>

      <p className="text-gray-300 text-sm font-medium mb-1">
        {item.title || "Activity Logged"}
      </p>

      {item.type && (
        <p className="text-gray-500 text-xs mb-2">
          Event: {item.type}
        </p>
      )}

      {item.description && (
        <p className="text-gray-400 text-sm">
          {item.description}
        </p>
      )}

      {!item.description && (
        <p className="text-gray-400 text-sm">
          {item.intensity} contribution
          {item.intensity > 1 ? "s" : ""}
        </p>
      )}
    </>
  );
}