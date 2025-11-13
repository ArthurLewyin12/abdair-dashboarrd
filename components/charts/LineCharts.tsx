import React from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface LineChartProps {
  data: Array<Record<string, any>>;
  xAxisDataKey: string;
  lines: Array<{
    dataKey: string;
    color: string;
    name?: string;
    font?: React.CSSProperties;
  }>;
  height?: number | `${number}%`;

  grid?: boolean;
  gridColor?: string;
  legend?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
  tooltipStyle?: React.CSSProperties;
  tooltipFormatter?: (
    value: number,
    name: string,
    props: any,
  ) => [string, string];
  tooltipLabelFormatter?: (label: string) => string;
  tooltipItemStyle?: React.CSSProperties;
  tooltipLabelStyle?: React.CSSProperties;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisDataKey,
  lines,
  height = 300,
  grid = true,
  legend = true,
  yAxisLabel,
  xAxisLabel,
  tooltipStyle,
  tooltipFormatter,
  tooltipLabelFormatter,
  tooltipItemStyle,
  tooltipLabelStyle = {
    fontWeight: "bold",
    marginBottom: "4px",
    fontFamily: "Urbanist",
  },
}) => {
  // Tooltip personnalisé pour une meilleure personnalisation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E9EAEB",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "10px 14px",
            ...tooltipStyle,
          }}
        >
          <p style={tooltipLabelStyle}>
            {tooltipLabelFormatter ? tooltipLabelFormatter(label) : label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={`tooltip-item-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "6px",
                ...tooltipItemStyle,
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  marginRight: "8px",
                }}
              />
              <span
                style={{
                  fontFamily: "Urbanist",
                  color: entry.color,
                  fontSize: "14px",
                  marginRight: "6px",
                }}
              >
                {entry.name}:
              </span>
              <span
                style={{
                  fontFamily: "Urbanist",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: entry.color,
                }}
              >
                {tooltipFormatter
                  ? tooltipFormatter(entry.value, entry.name, entry.payload)[0]
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 1,
          right: 30,
          left: -30,
          bottom: 0,
        }}
      >
        {grid && (
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
            stroke="#252B37"
            strokeWidth={0.7}
          />
        )}
        <XAxis
          dataKey={xAxisDataKey}
          tick={{ fontSize: 14, fill: "#535862", fontFamily: "Urbanist" }}
          label={
            xAxisLabel
              ? { value: xAxisLabel, position: "insideBottom", offset: -5 }
              : undefined
          }
        />
        <YAxis
          tick={{ fontSize: 14, fill: "#535862", fontFamily: "Urbanist" }}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }
              : undefined
          }
        />
        <Tooltip content={<CustomTooltip />} />
        {legend && <Legend />}
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 3, fill: line.color, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: line.color }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
