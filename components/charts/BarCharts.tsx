import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface BarChartProps {
  data: Array<Record<string, any>>;
  xAxisDataKey: string;
  bars: Array<{
    dataKey: string;
    color: string;
    name?: string;
    opacity?: number; // permet d'atténuer une série en overlay
  }>;
  height?: number | `${number}%`;
  grid?: boolean;
  gridColor?: string;
  legend?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
  stacked?: boolean;
  cornerRadius?: number;
  // Permettre un contrôle fin des graduations et formatage de l'axe Y
  yAxisTicks?: number[];
  yAxisTickFormatter?: (value: number, index: number) => string;
  // Style avancé
  barSize?: number; // largeur des barres pour un rendu fin
  barGap?: number | string; // chevauchement horizontal entre barres
  barCategoryGap?: number | string; // écart entre catégories
  roundTopAll?: boolean; // arrondir le haut de toutes les barres (même non top en stack ou en superposition)
  overlay?: boolean; // superposition (axe Z) des séries plutôt que sum stacking
  barRoundBottom?: boolean; // arrondir aussi le bas des barres (optionnel)
  overlayOrder?: "max" | "sum" | "none"; // ordre des séries en overlay: plus grande au fond
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

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisDataKey,
  bars,
  height = 50,
  grid = true,
  gridColor,
  legend = true,
  yAxisLabel,
  xAxisLabel,
  stacked = false,
  cornerRadius,
  yAxisTicks,
  yAxisTickFormatter,
  barSize,
  barGap,
  barCategoryGap,
  roundTopAll,
  overlay,
  barRoundBottom,
  overlayOrder = "max",
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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Calcul du total pour les graphiques empilés si nécessaire
      const total = stacked
        ? payload.reduce(
            (sum: number, entry: any) => sum + (entry.value || 0),
            0,
          )
        : null;

      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E9EAEB",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "12px 16px",
            minWidth: "180px",
            ...tooltipStyle,
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              fontFamily: "Urbanist",
              fontSize: "14px",
              color: "#1E293B",
              ...tooltipLabelStyle,
            }}
          >
            {tooltipLabelFormatter ? tooltipLabelFormatter(label) : label}
          </p>

          {/* Ligne horizontale de séparation */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#E9EAEB",
              margin: "8px 0",
            }}
          />

          {/* Entries */}
          {payload.map((entry: any, index: number) => (
            <div
              key={`tooltip-item-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
                ...tooltipItemStyle,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: entry.color,
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Urbanist",
                    color: "#475569",
                    fontSize: "13px",
                  }}
                >
                  {entry.name}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Urbanist",
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#1E293B",
                  marginLeft: "12px",
                }}
              >
                {tooltipFormatter
                  ? tooltipFormatter(entry.value, entry.name, entry.payload)[0]
                  : entry.value}
              </span>
            </div>
          ))}

          {/* Affiche le total pour les graphiques empilés */}
          {stacked && total !== null && (
            <>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  margin: "8px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Urbanist",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "Urbanist",
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#1E293B",
                  }}
                >
                  {tooltipFormatter
                    ? tooltipFormatter(total, "Total", null)[0]
                    : total}
                </span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Calcul d'un ordre dérivé pour l'overlay afin que la série la plus grande soit rendue en premier (fond)
  const aggregateSeries = (dataKey: string) => {
    const values = Array.isArray(data)
      ? data.map((d) => Number(d?.[dataKey]) || 0)
      : [];
    if (overlayOrder === "sum") return values.reduce((a, b) => a + b, 0);
    if (overlayOrder === "max") return values.length ? Math.max(...values) : 0;
    return 0;
  };

  const derivedBars =
    overlay && overlayOrder !== "none"
      ? [...bars].sort(
          (a, b) => aggregateSeries(b.dataKey) - aggregateSeries(a.dataKey),
        )
      : bars;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 1,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        barGap={
          overlay ? (typeof barSize === "number" ? -barSize : -14) : barGap
        }
        barCategoryGap={barCategoryGap}
      >
        <defs>
          {derivedBars.map((bar, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`barColor-${index}-${bar.color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={bar.color}
                stopOpacity={typeof bar.opacity === "number" ? bar.opacity : 1}
              />
              <stop
                offset="100%"
                stopColor={bar.color}
                stopOpacity={
                  typeof bar.opacity === "number"
                    ? Math.max(0, Math.min(1, bar.opacity * 0.8))
                    : 0.8
                }
              />
            </linearGradient>
          ))}
        </defs>

        {grid && (
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.3}
            stroke={gridColor || "#252B37"}
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
        {derivedBars.map((bar, index) => {
          const effectiveCorner =
            typeof cornerRadius === "number"
              ? cornerRadius
              : Math.ceil(
                  ((typeof barSize === "number" ? barSize : 14) as number) / 2,
                );
          const bottomCorner = barRoundBottom ? effectiveCorner : 0;
          const radius = roundTopAll
            ? [effectiveCorner, effectiveCorner, bottomCorner, bottomCorner]
            : stacked
              ? index === derivedBars.length - 1
                ? [effectiveCorner, effectiveCorner, bottomCorner, bottomCorner]
                : [0, 0, bottomCorner, bottomCorner]
              : index === derivedBars.length - 1
                ? [effectiveCorner, effectiveCorner, bottomCorner, bottomCorner]
                : [0, 0, bottomCorner, bottomCorner];

          return (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={
                typeof bar.opacity === "number"
                  ? `url(#barColor-${index}-${bar.color.replace("#", "")})`
                  : bar.color
              }
              stroke={bar.color}
              strokeWidth={1}
              radius={
                radius as unknown as number | [number, number, number, number]
              }
              stackId={stacked ? "a" : undefined}
              barSize={barSize}
            />
          );
        })}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
