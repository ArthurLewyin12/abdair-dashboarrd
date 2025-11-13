import React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface AreaChartProps {
  data: Array<Record<string, any>>;
  xAxisDataKey: string;
  areas: Array<{
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
  // Contrôle de l'axe Y (graduations et formatage)
  yAxisTicks?: number[];
  yAxisTickFormatter?: (value: number, index: number) => string;
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

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xAxisDataKey,
  areas,
  height = 300,
  grid = true,
  gridColor,
  legend = true,
  yAxisLabel,
  xAxisLabel,
  yAxisTicks,
  yAxisTickFormatter,
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
      <RechartsAreaChart
        data={data}
        margin={{
          top: 1,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          {areas.map((area, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`gradient-${index}-${area.color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={area.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>

        {grid && (
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.2}
            stroke={gridColor || "#252B37"}
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
          ticks={yAxisTicks}
          tickFormatter={yAxisTickFormatter}
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
        {areas.map((area, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name || area.dataKey}
            stroke={area.color}
            fill={`url(#gradient-${index}-${area.color.replace("#", "")})`}
            strokeWidth={2}
            dot={{ r: 3, fill: area.color, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: area.color }}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
