import React, { useState } from 'react';
import { Sparkles, Sliders, Layers, RefreshCw, Copy, Check } from 'lucide-react';

type ShapeType = 'rect' | 'ellipse' | 'star' | 'watermelon';

export const InteractiveSandbox: React.FC = () => {
  const [activeShape, setActiveShape] = useState<ShapeType>('rect');

  // Rect properties
  const [rectW, setRectW] = useState(260);
  const [rectH, setRectH] = useState(160);
  const [rectRx, setRectRx] = useState(25);
  const [rectRy, setRectRy] = useState(25);

  // Ellipse properties
  const [ellipseRx, setEllipseRx] = useState(130);
  const [ellipseRy, setEllipseRy] = useState(85);
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(360);

  // Star & Polygon properties
  const [starCorners, setStarCorners] = useState(5);
  const [spokeRatio, setSpokeRatio] = useState(0.45);
  const [rounded, setRounded] = useState(0.0);
  const [randomized, setRandomized] = useState(0.0);

  // Colors (Fill & Stroke - Bài 13 Mục 2)
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#1d4ed8');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const [copied, setCopied] = useState(false);

  // Helper for star points calculation
  const generateStarPath = (
    cx: number,
    cy: number,
    points: number,
    outerR: number,
    ratio: number,
    round: number,
    rand: number
  ) => {
    const totalVertices = points * 2;
    const innerR = outerR * ratio;
    const pts: { x: number; y: number }[] = [];

    for (let i = 0; i < totalVertices; i++) {
      const isOuter = i % 2 === 0;
      let r = isOuter ? outerR : innerR;
      if (rand > 0) {
        r *= 1 + Math.sin(i * 997 + points * 13) * rand;
      }
      const angle = (i * Math.PI) / points - Math.PI / 2;
      pts.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r
      });
    }

    if (round <= 0.01) {
      return pts.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '') + ' Z';
    }

    // Bezier curve approximation
    const n = pts.length;
    let d = `M ${(pts[0].x + pts[1].x) / 2} ${(pts[0].y + pts[1].y) / 2}`;
    for (let i = 0; i < n; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      d += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
    }
    return d + ' Z';
  };

  // Helper for SVG Arc
  const describeArc = (x: number, y: number, rx: number, ry: number, startA: number, endA: number) => {
    if (Math.abs(endA - startA) >= 360) {
      return `M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} Z`;
    }
    const startRad = ((startA - 90) * Math.PI) / 180;
    const endRad = ((endA - 90) * Math.PI) / 180;

    const x1 = x + rx * Math.cos(startRad);
    const y1 = y + ry * Math.sin(startRad);
    const x2 = x + rx * Math.cos(endRad);
    const y2 = y + ry * Math.sin(endRad);

    const delta = (endA - startA + 360) % 360;
    const largeArcFlag = delta > 180 ? 1 : 0;

    return `M ${x} ${y} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
  };

  const handleCopySVG = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sliders className="w-4 h-4" />
            <span>Phòng Thực Hành Trực Quan (Inkscape)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            Tự do thử nghiệm thuộc tính các hình khối
          </h3>
        </div>

        {/* Shape Mode Switcher - Scrollable on mobile */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1 flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => {
              setActiveShape('rect');
              setFillColor('#3b82f6');
              setStrokeColor('#1d4ed8');
            }}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeShape === 'rect'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Chữ nhật (W, H, Rx)
          </button>
          <button
            onClick={() => {
              setActiveShape('ellipse');
              setFillColor('#10b981');
              setStrokeColor('#047857');
            }}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeShape === 'ellipse'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Elip (Rx, Start, End)
          </button>
          <button
            onClick={() => {
              setActiveShape('star');
              setFillColor('#f59e0b');
              setStrokeColor('#b45309');
            }}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeShape === 'star'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Sao & Đa giác
          </button>
          <button
            onClick={() => {
              setActiveShape('watermelon');
            }}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeShape === 'watermelon'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 shadow-sm border border-red-200 dark:border-red-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🍉 Dưa hấu SGK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-5">
        {/* Left: Interactive Canvas / SVG Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[250px] sm:h-[340px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-3">
            {/* Inkscape blueprint grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            <svg
              className="w-full h-full"
              viewBox="0 0 500 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              {activeShape === 'rect' && (
                <g>
                  {/* Rectangle */}
                  <rect
                    x={250 - rectW / 2}
                    y={160 - rectH / 2}
                    width={rectW}
                    height={rectH}
                    rx={rectRx}
                    ry={rectRy}
                    fill={fillColor}
                    fillOpacity="0.85"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />

                  {/* Corner handle nodes */}
                  <rect
                    x={250 - rectW / 2 - 4}
                    y={160 - rectH / 2 - 4}
                    width={8}
                    height={8}
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth={1.5}
                  />
                  <rect
                    x={250 + rectW / 2 - 4}
                    y={160 + rectH / 2 - 4}
                    width={8}
                    height={8}
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={250 + rectW / 2 - rectRx}
                    cy={160 - rectH / 2}
                    r={5}
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth={1.5}
                  />
                </g>
              )}

              {activeShape === 'ellipse' && (
                <g>
                  <path
                    d={describeArc(250, 160, ellipseRx, ellipseRy, startAngle, endAngle)}
                    fill={fillColor}
                    fillOpacity="0.85"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={250}
                    cy={160}
                    r={4}
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth={1.5}
                  />
                </g>
              )}

              {activeShape === 'star' && (
                <g>
                  <path
                    d={generateStarPath(250, 160, starCorners, 110, spokeRatio, rounded, randomized)}
                    fill={fillColor}
                    fillOpacity="0.85"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                </g>
              )}

              {activeShape === 'watermelon' && (
                <g transform="translate(250, 160)">
                  {/* Layer 1: Green rind */}
                  <path
                    d="M 0 0 L 140 0 A 140 140 0 0 1 -140 0 Z"
                    fill="#15803d"
                    stroke="#14532d"
                    strokeWidth={2}
                  />
                  {/* Layer 2: White rind border */}
                  <path
                    d="M 0 0 L 128 0 A 128 128 0 0 1 -128 0 Z"
                    fill="#dcfce7"
                  />
                  {/* Layer 3: Red juicy flesh */}
                  <path
                    d="M 0 0 L 118 0 A 118 118 0 0 1 -118 0 Z"
                    fill="#ef4444"
                  />
                  {/* Layer 4: Watermelon seeds */}
                  {[
                    { a: 30, d: 80 },
                    { a: 60, d: 75 },
                    { a: 90, d: 85 },
                    { a: 120, d: 75 },
                    { a: 150, d: 80 },
                    { a: 50, d: 45 },
                    { a: 100, d: 45 },
                    { a: 130, d: 45 },
                  ].map((seed, i) => {
                    const rad = (seed.a * Math.PI) / 180;
                    const sx = Math.cos(rad) * seed.d;
                    const sy = Math.sin(rad) * seed.d;
                    return (
                      <ellipse
                        key={i}
                        cx={sx}
                        cy={sy}
                        rx={3}
                        ry={6}
                        transform={`rotate(${seed.a - 90} ${sx} ${sy})`}
                        fill="#0f172a"
                      />
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Quick status badge */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded-md text-[11px] font-mono text-slate-300">
              {activeShape === 'rect' && `W: ${rectW}px · H: ${rectH}px · Rx: ${rectRx}px · Ry: ${rectRy}px`}
              {activeShape === 'ellipse' && `Rx: ${ellipseRx}px · Ry: ${ellipseRy}px · Start: ${startAngle}° · End: ${endAngle}°`}
              {activeShape === 'star' && `Corners: ${starCorners} · Ratio: ${spokeRatio.toFixed(2)} · Rounded: ${rounded.toFixed(2)} · Rand: ${randomized.toFixed(2)}`}
              {activeShape === 'watermelon' && 'Miếng dưa hấu 4 lớp: Vỏ xanh · Cùi trắng · Ruột đỏ · Hạt đen'}
            </div>
          </div>

          {/* Quick presets for Star based on Hình 13.2 SGK */}
          {activeShape === 'star' && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Mẫu SGK (Hình 13.2):
              </span>
              <button
                onClick={() => {
                  setStarCorners(5);
                  setSpokeRatio(0.45);
                  setRounded(0);
                  setRandomized(0);
                }}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                1. Sao 5 cánh nhọn
              </button>
              <button
                onClick={() => {
                  setStarCorners(5);
                  setSpokeRatio(0.81);
                  setRounded(0);
                  setRandomized(0);
                }}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                2. Ngũ giác đều
              </button>
              <button
                onClick={() => {
                  setStarCorners(5);
                  setSpokeRatio(0.45);
                  setRounded(0.35);
                  setRandomized(0);
                }}
                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded text-amber-800 dark:text-amber-300 font-medium hover:bg-amber-100"
              >
                3. Đỉnh cong (Câu hỏi p.70)
              </button>
              <button
                onClick={() => {
                  setStarCorners(6);
                  setSpokeRatio(0.4);
                  setRounded(0.5);
                  setRandomized(0);
                }}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                4. Cánh hoa tròn
              </button>
            </div>
          )}
        </div>

        {/* Right: Parameter Controls Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Shape-specific sliders */}
            {activeShape === 'rect' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">W (Chiều rộng - Width):</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{rectW} px</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={400}
                    value={rectW}
                    onChange={(e) => setRectW(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">H (Chiều dài / cao - Height):</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{rectH} px</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={260}
                    value={rectH}
                    onChange={(e) => setRectH(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-amber-600 dark:text-amber-400">Rx, Ry (Bán kính góc bo):</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{rectRx} px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.min(rectW, rectH) / 2}
                    value={rectRx}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setRectRx(v);
                      setRectRy(v);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {rectRx === 0
                      ? '• Rx = 0: Các góc của hình là góc vuông nhọn chuẩn.'
                      : `• Rx = ${rectRx}px: Bo tròn góc hình mềm mại.`}
                  </p>
                </div>
              </div>
            )}

            {activeShape === 'ellipse' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Rx (Bán kính phương ngang):</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{ellipseRx} px</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={180}
                    value={ellipseRx}
                    onChange={(e) => setEllipseRx(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Ry (Bán kính phương đứng):</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{ellipseRy} px</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={ellipseRy}
                    onChange={(e) => setEllipseRy(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Start (Góc bắt đầu):</span>
                    <span className="text-blue-600 font-semibold">{startAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={startAngle}
                    onChange={(e) => setStartAngle(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">End (Góc kết thúc):</span>
                    <span className="text-purple-600 font-semibold">{endAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={endAngle}
                    onChange={(e) => setEndAngle(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeShape === 'star' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Corners (Số đỉnh/cánh):</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{starCorners}</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={16}
                    value={starCorners}
                    onChange={(e) => setStarCorners(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Spoke ratio (Tỉ lệ bán kính trong/ngoài):</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{spokeRatio.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.15}
                    max={0.95}
                    step={0.01}
                    value={spokeRatio}
                    onChange={(e) => setSpokeRatio(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-red-600 dark:text-red-400">Rounded (Độ cong tại đỉnh):</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">{rounded.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.02}
                    value={rounded}
                    onChange={(e) => setRounded(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {rounded === 0
                      ? '• Rounded = 0: Các đỉnh sao nhọn sắc nét.'
                      : `• Rounded = ${rounded.toFixed(2)}: Làm tròn các đỉnh sao thành cánh hoa mềm mại!`}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Randomized (Độ méo ngẫu nhiên):</span>
                    <span className="text-slate-600 font-semibold">{randomized.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.35}
                    step={0.01}
                    value={randomized}
                    onChange={(e) => setRandomized(Number(e.target.value))}
                    className="w-full accent-slate-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeShape === 'watermelon' && (
              <div className="space-y-3 p-4 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/40">
                <h4 className="text-sm font-bold text-red-900 dark:text-red-300">
                  Phân tích cấu trúc các lớp (Hình 13.1 SGK)
                </h4>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-700 shrink-0" />
                    <span><strong>Lớp 1 (Dưới cùng):</strong> Vỏ dưa hấu màu xanh đậm (hình quạt R = 140)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-200 shrink-0" />
                    <span><strong>Lớp 2:</strong> Phần cùi dưa màu trắng xanh (R = 128)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                    <span><strong>Lớp 3:</strong> Ruột dưa hấu màu đỏ mọng (R = 118)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-900 shrink-0" />
                    <span><strong>Lớp 4 (Trên cùng):</strong> Các hạt dưa hình giọt nước xếp xoay vòng</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Palettes (Fill & Stroke - Mục 2 SGK Bài 13) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <span className="text-slate-500 font-medium">Tô (Fill):</span>
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <span className="text-slate-500 font-medium">Viền (Stroke):</span>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                />
              </label>
            </div>

            <button
              onClick={() => {
                setRectW(260);
                setRectH(160);
                setRectRx(25);
                setRectRy(25);
                setEllipseRx(130);
                setEllipseRy(85);
                setStartAngle(0);
                setEndAngle(360);
                setStarCorners(5);
                setSpokeRatio(0.45);
                setRounded(0);
                setRandomized(0);
              }}
              className="min-h-[44px] px-3 flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Đặt lại mặc định</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
