"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

type Activity = {
  id: number;
  title: string;
  url: string;
  description: string;
  activity_date: string;
  platform: string;
  type: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activity/recent")
      .then((res) => res.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <section className="mt-20">
      <h3 className="text-2xl font-bold text-white mb-8">
        🚀 Contribution Activity
      </h3>

      <div className="relative border-l border-gray-800 pl-6 space-y-8">
        {activities.map((item) => (
          <div key={item.id} className="relative">
            
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0e1621]" />

            <a
              href={item.url}
              target="_blank"
              className="block bg-[#161b22] p-5 rounded-xl border border-gray-800 hover:border-green-500 transition-all"
            >
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <p className="text-green-400 font-semibold">
                  {item.title}
                </p>

                <span className="text-xs text-gray-400">
                  {format(
                    new Date(item.activity_date),
                    "MMM dd, yyyy"
                  )}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-3">
                {item.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 text-xs bg-gray-800 rounded-md text-gray-400 capitalize">
                  {item.platform}
                </span>

                <span className="px-2 py-1 text-xs bg-green-900/40 text-green-400 rounded-md">
                  {item.type}
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}