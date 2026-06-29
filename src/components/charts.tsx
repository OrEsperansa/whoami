"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trend } from "@/lib/demo-data";

export function AccuracyChart() {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={trend}>
        <defs>
          <linearGradient id="accuracy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis dataKey="day" stroke="#71717a" />
        <YAxis stroke="#71717a" domain={[70, 100]} />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8 }} />
        <Area type="monotone" dataKey="accuracy" stroke="#2dd4bf" fill="url(#accuracy)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SpeedChart() {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={trend}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis dataKey="day" stroke="#71717a" />
        <YAxis stroke="#71717a" />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8 }} />
        <Bar dataKey="speed" fill="#60a5fa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={trend}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis dataKey="day" stroke="#71717a" />
        <YAxis stroke="#71717a" />
        <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8 }} />
        <Bar dataKey="sessions" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
