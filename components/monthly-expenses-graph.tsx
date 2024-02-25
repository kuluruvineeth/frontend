"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dummyData = [
  {
    name: "N/A",
    fullname: "None",
    value: Math.floor(Math.random() * 5000) + 1000,
  },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded shadow p-2 border border-slate-200 bg-white">
        <p className="font-semibold text-base">{payload[0].payload.fullName}</p>
        <p className="intro">{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function MonthlyExpensesGraph({
  data,
}: {
  data: { name: string; fullname: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        data={dummyData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          stroke="#334155"
          fontSize={11}
          padding={{ left: 6, right: 2 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#334155"
          fontSize={11}
          width={20}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Bar dataKey={"value"} fill="#00E1F0" radius={[3, 3, 3, 3]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
