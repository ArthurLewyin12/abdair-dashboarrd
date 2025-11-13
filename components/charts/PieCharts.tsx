import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number | string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  colors?: string[];
  tooltipFormatter?: (value: number, name: string) => [string, string];
  labelFormatter?: (entry: any) => string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  innerRadius = 60, // Changé de 0 à 60 pour créer l'effet d'anneau
  outerRadius = 100,
  showLegend = true,
  showLabels = false,
  colors = [
    "#4F46E5",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
  ],
  tooltipFormatter,
  labelFormatter,
}) => {
  // Assigner les couleurs aux données si elles ne sont pas définies
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }));

  // Calculer le total pour afficher le pourcentage au centre
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E9EAEB",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "12px 16px",
            minWidth: "150px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: data.payload.color,
              }}
            />
            <span
              style={{
                fontFamily: "Urbanist",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1E293B",
              }}
            >
              {data.name}
            </span>
          </div>
          <div style={{ marginTop: "6px" }}>
            <span
              style={{
                fontFamily: "Urbanist",
                fontWeight: "700",
                fontSize: "16px",
                color: "#1E293B",
              }}
            >
              {tooltipFormatter
                ? tooltipFormatter(data.value, data.name)[0]
                : `${percentage}%`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    if (!showLabels) return null;
    return labelFormatter ? labelFormatter(entry) : `${entry.value}`;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingLeft: "20px",
          justifyContent: "center",
          height: "100%",
          minWidth: "150px",
        }}
      >
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <div
              key={`legend-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  flexShrink: 0,
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span
                  style={{
                    fontFamily: "Urbanist",
                    fontSize: "13px",
                    color: "#1E293B",
                    fontWeight: "600",
                  }}
                >
                  {entry.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: "16px", width: "100%", height }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 1, height: "100%", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {dataWithColors.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  content={<CustomLegend />}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: "20px",
                    lineHeight: "24px",
                  }}
                />
              )}
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
