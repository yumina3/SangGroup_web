import { useId } from "react";

const DEFAULT_WIDTH = 720;

/** Skala atas yang bulat agar label sumbu Y mudah dibaca. */
function scaleMax(values, ticks) {
  const highest = Math.max(0, ...values);
  if (highest === 0) return ticks;
  return Math.ceil(highest / ticks) * ticks;
}

/**
 * Grafik tren SVG tanpa pustaka chart.
 *
 * Satu komponen menangani dua kebutuhan desain:
 * - `showAllBadges` untuk grafik pengajuan per bulan (label nilai di setiap
 *   titik, titik puncak disorot).
 * - dua seri sekaligus untuk tren kinerja (pengajuan dan deal), dengan label
 *   nilai hanya di titik terakhir agar grafik tetap bersih.
 *
 * Semua koordinat dihitung dari `viewBox`, jadi grafik menyesuaikan lebar
 * kontainer tanpa mengubah ukuran teks.
 */
export default function TrendChart({
  labels,
  series,
  ariaLabel,
  showAllBadges = false,
  showLastValues = true,
  yTicks = 4,
  height = 260,
  width = DEFAULT_WIDTH,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const margin = { top: 30, right: 24, bottom: 36, left: 44 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxValue = scaleMax(
    series.flatMap((item) => item.values),
    yTicks,
  );
  const bottom = margin.top + innerHeight;

  const xAt = (index) =>
    labels.length <= 1
      ? margin.left + innerWidth / 2
      : margin.left + (index * innerWidth) / (labels.length - 1);
  const yAt = (value) => margin.top + innerHeight - (value / maxValue) * innerHeight;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full overflow-visible"
    >
      <title>{ariaLabel}</title>

      <defs>
        {series.map((item, index) => (
          <linearGradient
            key={item.key}
            id={`${uid}-area-${index}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={item.color} stopOpacity={item.areaOpacity ?? 0.2} />
            <stop offset="100%" stopColor={item.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {Array.from({ length: yTicks + 1 }, (_, index) => {
        const value = (maxValue / yTicks) * index;
        const y = yAt(value);

        return (
          <g key={value}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={y}
              y2={y}
              stroke={index === 0 ? "#E2E8F0" : "#EEF2F6"}
              strokeWidth="1"
              strokeDasharray={index === 0 ? undefined : "3 4"}
            />
            <text
              x={margin.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#94A3B8"
            >
              {value}
            </text>
          </g>
        );
      })}

      {series.map((item, seriesIndex) => {
        const points = item.values.map((value, index) => ({
          x: xAt(index),
          y: yAt(value),
          value,
        }));
        const line = points.map((point) => `${point.x},${point.y}`).join(" ");
        const area = `${line} ${points[points.length - 1].x},${bottom} ${points[0].x},${bottom}`;
        const lastPoint = points[points.length - 1];

        return (
          <g key={item.key}>
            {item.area !== false ? (
              <polygon points={area} fill={`url(#${uid}-area-${seriesIndex})`} />
            ) : null}

            <polyline
              points={line}
              fill="none"
              stroke={item.color}
              strokeWidth={item.width ?? 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => {
              const isLast = index === points.length - 1;

              return (
                <g key={`${item.key}-${labels[index]}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isLast ? 5 : 4}
                    fill={isLast ? item.color : "#FFFFFF"}
                    stroke={isLast ? "#FFFFFF" : item.color}
                    strokeWidth={isLast ? 2 : 2.5}
                  >
                    <title>{`${labels[index]}: ${point.value} ${item.label}`}</title>
                  </circle>

                  {showAllBadges ? (
                    <ValueBadge
                      x={point.x}
                      y={point.y}
                      value={point.value}
                      highlighted={point.value === Math.max(...item.values)}
                      width={width}
                    />
                  ) : null}
                </g>
              );
            })}

            {!showAllBadges && showLastValues ? (
              <text
                x={lastPoint.x}
                y={Math.max(lastPoint.y - 11, 13)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={item.color}
                stroke="#FFFFFF"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {lastPoint.value}
              </text>
            ) : null}
          </g>
        );
      })}

      {labels.map((label, index) => {
        const isLast = index === labels.length - 1;

        return (
          <text
            key={label}
            x={xAt(index)}
            y={height - 12}
            textAnchor="middle"
            fontSize="12"
            fontWeight={isLast ? "700" : "500"}
            fill={isLast ? "#0D3B2E" : "#64748B"}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/** Label nilai kecil di atas titik grafik pengajuan per bulan. */
function ValueBadge({ x, y, value, highlighted, width }) {
  const badgeWidth = 32;
  const badgeHeight = 20;
  const badgeX = Math.min(Math.max(x - badgeWidth / 2, 2), width - badgeWidth - 2);
  const badgeY = Math.max(y - 30, 2);

  return (
    <g>
      <rect
        x={badgeX}
        y={badgeY}
        width={badgeWidth}
        height={badgeHeight}
        rx="4"
        fill={highlighted ? "#C5A059" : "#0D3B2E"}
      />
      <text
        x={badgeX + badgeWidth / 2}
        y={badgeY + 14}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={highlighted ? "#0D3B2E" : "#FFFFFF"}
      >
        {value}
      </text>
    </g>
  );
}
