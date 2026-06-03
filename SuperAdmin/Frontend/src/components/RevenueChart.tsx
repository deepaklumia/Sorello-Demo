import React, { useState } from 'react';

interface RevenueChartProps {
  data?: number[];
  labels?: string[];
  height?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [35, 48, 38, 55, 50, 85, 75],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  height = 200,
}) => {
  const [activeTab, setActiveTab] = useState<'1D' | '1W' | '1M'>('1W');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(5); // Default to Sat (peak) as in mock

  const width = 500;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...data) * 1.15;
  const minVal = Math.min(...data) * 0.85;
  const range = maxVal - minVal;

  const points = data.map((val, i) => {
    const x = paddingX + (i * (width - paddingX * 2)) / (data.length - 1);
    const y = height - paddingY - ((val - minVal) * (height - paddingY * 2)) / range;
    return { x, y, value: val };
  });

  // Generate Bezier path string
  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = getBezierPath(points);
  
  // Closed path for gradient fill
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-[360px] relative">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide font-heading">Revenue Growth</h4>
          <p className="text-xs text-space-muted">Real-time platform transaction volume (MTD)</p>
        </div>
        
        {/* Toggle options */}
        <div className="flex gap-1.5 bg-space-dark border border-space-border rounded-lg p-0.5">
          {(['1D', '1W', '1M'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-space-surface text-accent-cyan border border-space-border shadow-sm'
                  : 'text-space-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative flex-1 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Area under line gradient */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9D00FF" stopOpacity="0.0" />
            </linearGradient>
            {/* Line stroke gradient */}
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#9D00FF" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#2C3A5A"
            strokeOpacity="0.3"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#2C3A5A"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#2C3A5A"
            strokeOpacity="0.15"
          />

          {/* Render Area under line */}
          {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

          {/* Render Path Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Grid Dots / Intersections */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 6 : 4}
                className={`transition-all duration-200 cursor-pointer ${
                  hoveredIndex === i
                    ? 'fill-accent-cyan stroke-white stroke-2 shadow-lg'
                    : 'fill-space-surface stroke-space-border stroke-2 hover:fill-accent-cyan'
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-space-muted font-sans font-medium"
            >
              {labels[i]}
            </text>
          ))}
        </svg>

        {/* Hover Peak Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-10 bg-space-dark border border-accent-cyan rounded-lg p-2 shadow-xl pointer-events-none transition-all duration-200"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 15}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex flex-col gap-0.5 items-center">
              <span className="text-[8px] font-bold text-accent-cyan uppercase tracking-wider">
                {hoveredIndex === 5 ? 'PEAK VOLUME' : 'VOLUME'}
              </span>
              <span className="text-[11px] font-bold text-white">
                ${(points[hoveredIndex].value * 2100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            {/* Arrow */}
            <div className="w-1.5 h-1.5 bg-space-dark border-r border-b border-accent-cyan rotate-45 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};
