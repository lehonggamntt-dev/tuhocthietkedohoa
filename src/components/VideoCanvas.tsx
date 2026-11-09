import React, { useEffect, useRef } from 'react';
import { SCENES } from '../types/video';

interface VideoCanvasProps {
  currentTime: number; // 0 to 45
  isPlaying: boolean;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({ currentTime, onCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (onCanvasRef && canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
  }, [onCanvasRef]);

  // Main rendering engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal resolution 1280x720 (16:9 HD standard)
    const W = 1280;
    const H = 720;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    const t = Math.max(0, Math.min(45, currentTime));

    // Determine current scene
    const currentScene = SCENES.find((s) => t >= s.startTime && t <= s.endTime) || SCENES[SCENES.length - 1];
    const sceneProgress = (t - currentScene.startTime) / Math.max(0.1, currentScene.endTime - currentScene.startTime);

    // 1. Draw Clean Educational Vector Studio Background
    ctx.clearRect(0, 0, W, H);

    // Soft gradient studio paper
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#0b1120');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Vector Grid (Inkscape blueprint grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= W; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, W, 72);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeRect(0, 0, W, 72);

    // Textbook badge in header
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TIN HỌC 10 · BÀI 13', 36, 42);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 20px "Outfit", sans-serif';
    ctx.fillText('BỔ SUNG CÁC ĐỐI TƯỢNG ĐỒ HOẠ (INKSCAPE)', 220, 43);

    // Scene number indicator in header
    ctx.fillStyle = currentScene.accentColor;
    ctx.fillRect(W - 300, 18, 120, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(`CẢNH 0${currentScene.id}/05`, W - 285, 41);

    // Timecode in header
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 10);
    const timecode = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms} / 00:45.0`;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText(timecode, W - 160, 41);

    // Scene Main Title & Subtitle Card (Lower third or upper banner)
    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, 36, 90, W - 72, 82, 14);
    ctx.fill();
    ctx.stroke();

    // Scene Title
    ctx.fillStyle = currentScene.accentColor;
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(currentScene.badge.toUpperCase(), 56, 118);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Outfit", sans-serif';
    ctx.fillText(currentScene.title, 56, 150);

    // Right side property tags
    const tags = currentScene.keyProperties;
    let tagX = W - 56;
    for (let i = tags.length - 1; i >= 0; i--) {
      const tagText = tags[i].name;
      ctx.font = '700 13px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tagText).width;
      const boxWidth = textWidth + 24;
      tagX -= boxWidth;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = currentScene.accentColor;
      ctx.lineWidth = 1.5;
      roundRect(ctx, tagX, 110, boxWidth, 34, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(tagText, tagX + 12, 132);
      tagX -= 12;
    }
    ctx.restore();

    // 2. Render Scene-Specific Animations
    const stageY = 190;
    const stageH = 430;

    if (currentScene.id === 1) {
      renderScene1Overview(ctx, W, stageY, stageH, sceneProgress);
    } else if (currentScene.id === 2) {
      renderScene2Rectangle(ctx, W, stageY, stageH, sceneProgress, t);
    } else if (currentScene.id === 3) {
      renderScene3Ellipse(ctx, W, stageY, stageH, sceneProgress, t);
    } else if (currentScene.id === 4) {
      renderScene4StarPolygon(ctx, W, stageY, stageH, sceneProgress, t);
    } else {
      renderScene5Outro(ctx, W, stageY, stageH, sceneProgress, t);
    }

    // 3. Bottom Progress Bar & Script Caption Strip
    const bottomY = 635;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, bottomY, W, H - bottomY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, bottomY);
    ctx.lineTo(W, bottomY);
    ctx.stroke();

    // Red progress line
    const globalProgress = t / 45;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, bottomY, W * globalProgress, 4);

    // Active narration text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${currentScene.script}"`, W / 2, bottomY + 45);
    ctx.textAlign = 'left';

  }, [currentTime]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain"
      />
    </div>
  );
};

// ==================== HELPER RENDERING FUNCTIONS ====================

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * SCENE 1: Overview of 3 Shape Groups in Inkscape Toolbox
 */
function renderScene1Overview(
  ctx: CanvasRenderingContext2D,
  W: number,
  stageY: number,
  stageH: number,
  p: number
) {
  const midY = stageY + stageH / 2;
  const cards = [
    {
      tool: 'Phím R (F4)',
      title: 'Hình chữ nhật / Vuông',
      color: '#3b82f6',
      sub: 'Thuộc tính: W, H, Rx, Ry',
      draw: (cx: number, cy: number) => {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        roundRect(ctx, cx - 80, cy - 50, 160, 100, 16);
        ctx.fill();
        ctx.stroke();

        // Inkscape node handles
        drawNodeHandle(ctx, cx - 80, cy - 50, 'square');
        drawNodeHandle(ctx, cx + 80, cy + 50, 'square');
        drawNodeHandle(ctx, cx + 80, cy - 50, 'circle'); // corner radius node
      }
    },
    {
      tool: 'Phím E (F5)',
      title: 'Hình tròn / Elip',
      color: '#10b981',
      sub: 'Thuộc tính: Rx, Ry, Start, End',
      draw: (cx: number, cy: number) => {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 80, 55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node handles
        drawNodeHandle(ctx, cx, cy - 55, 'square');
        drawNodeHandle(ctx, cx + 80, cy, 'square');
        drawNodeHandle(ctx, cx - 80, cy, 'circle'); // start/end node
      }
    },
    {
      tool: 'Phím * (Shift+F9)',
      title: 'Đa giác & Ngôi sao',
      color: '#f59e0b',
      sub: 'Corners, Rounded, Spoke ratio...',
      draw: (cx: number, cy: number) => {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        drawStarPath(ctx, cx, cy, 5, 80, 36, 0, 0);
        ctx.fill();
        ctx.stroke();

        // Node handles
        drawNodeHandle(ctx, cx, cy - 80, 'square');
        drawNodeHandle(ctx, cx + 18, cy - 25, 'circle');
      }
    }
  ];

  const colWidth = (W - 120) / 3;
  cards.forEach((card, idx) => {
    const cx = 60 + colWidth * idx + colWidth / 2;
    const cardX = 60 + colWidth * idx + 10;
    const cardW = colWidth - 20;

    // Slide-up animation
    const enterOffset = Math.max(0, (1 - p * 2.5 + idx * 0.25) * 30);
    const alpha = Math.min(1, Math.max(0, (p * 2.5 - idx * 0.2)));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, enterOffset);

    // Card frame
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cardX, stageY + 20, cardW, stageH - 40, 16);
    ctx.fill();
    ctx.stroke();

    // Tool keyboard shortcut badge
    ctx.fillStyle = card.color;
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(card.tool, cardX + 24, stageY + 54);

    // Card title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Outfit", sans-serif';
    ctx.fillText(card.title, cardX + 24, stageY + 80);

    // Draw interactive shape preview
    card.draw(cx, midY + 10);

    // Subtitle properties
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.sub, cx, stageY + stageH - 50);
    ctx.textAlign = 'left';

    ctx.restore();
  });
}

/**
 * SCENE 2: Rectangle & Square Properties (W, H, Rx, Ry)
 */
function renderScene2Rectangle(
  ctx: CanvasRenderingContext2D,
  W: number,
  stageY: number,
  stageH: number,
  p: number,
  t: number
) {
  const cx = W / 2 - 120;
  const cy = stageY + stageH / 2;

  // Animate Width and Height first (0-50% scene), then Corner Radius Rx, Ry (50-100%)
  const isCornerPhase = p > 0.45;
  const cornerProgress = Math.max(0, Math.min(1, (p - 0.45) / 0.5));

  // W and H animated values
  const currentW = isCornerPhase ? 380 : 300 + Math.sin(t * 2.5) * 60;
  const currentH = isCornerPhase ? 240 : 180 + Math.cos(t * 2.5) * 35;

  // Corner radius animated from 0 to 45px
  const currentRx = isCornerPhase ? cornerProgress * 48 : 0;
  const currentRy = currentRx;

  const rectX = cx - currentW / 2;
  const rectY = cy - currentH / 2;

  // 1. Draw the Main Rectangle
  ctx.save();
  ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  roundRect(ctx, rectX, rectY, currentW, currentH, currentRx);
  ctx.fill();
  ctx.stroke();

  // Dimension line for Width (W)
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(rectX, rectY - 24);
  ctx.lineTo(rectX + currentW, rectY - 24);
  ctx.stroke();

  // Width arrowheads & label
  ctx.setLineDash([]);
  drawArrowHead(ctx, rectX, rectY - 24, Math.PI);
  drawArrowHead(ctx, rectX + currentW, rectY - 24, 0);

  ctx.fillStyle = '#60a5fa';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`W = ${Math.round(currentW)} px (Chiều rộng)`, cx, rectY - 34);

  // Dimension line for Height (H)
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(rectX - 24, rectY);
  ctx.lineTo(rectX - 24, rectY + currentH);
  ctx.stroke();

  ctx.setLineDash([]);
  drawArrowHead(ctx, rectX - 24, rectY, -Math.PI / 2);
  drawArrowHead(ctx, rectX - 24, rectY + currentH, Math.PI / 2);

  ctx.save();
  ctx.translate(rectX - 44, cy);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`H = ${Math.round(currentH)} px (Chiều dài)`, 0, 0);
  ctx.restore();

  // Inkscape-style Node Handles
  drawNodeHandle(ctx, rectX, rectY, 'square'); // Top-left size node
  drawNodeHandle(ctx, rectX + currentW, rectY + currentH, 'square'); // Bottom-right size node

  // Round corner node handle (Top-right)
  const cornerHandleX = rectX + currentW - currentRx;
  const cornerHandleY = rectY;
  drawNodeHandle(ctx, cornerHandleX, cornerHandleY, 'circle', '#f59e0b');

  // If corner phase, draw radius measurement arc
  if (currentRx > 2) {
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(rectX + currentW - currentRx, rectY + currentRy, currentRx, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Radius text
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Rx, Ry = ${Math.round(currentRx)} px`, rectX + currentW + 12, rectY + 20);
  }

  ctx.restore();

  // 2. Right Educational Explanatory Panel
  const panelX = W - 420;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  roundRect(ctx, panelX, stageY + 20, 360, stageH - 40, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillText('THANH ĐIỀU KHIỂN THUỘC TÍNH', panelX + 24, stageY + 56);

  // Property 1: W, H
  const activeWH = !isCornerPhase;
  ctx.fillStyle = activeWH ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = activeWH ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, panelX + 20, stageY + 80, 320, 72, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeWH ? '#93c5fd' : '#94a3b8';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('W, H: Chiều rộng, chiều dài', panelX + 36, stageY + 108);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Quy định kích thước của hình chữ nhật', panelX + 36, stageY + 132);

  // Property 2: Rx, Ry
  const activeRadius = isCornerPhase;
  ctx.fillStyle = activeRadius ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = activeRadius ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, panelX + 20, stageY + 168, 320, 100, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeRadius ? '#fcd34d' : '#94a3b8';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('Rx, Ry: Bán kính góc bo', panelX + 36, stageY + 196);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('• Bằng 0: Góc hình là góc vuông nhọn', panelX + 36, stageY + 224);
  ctx.fillText('• > 0: Bo tròn các góc mềm mại', panelX + 36, stageY + 248);

  // Textbook Tip Box
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.strokeStyle = '#10b981';
  roundRect(ctx, panelX + 20, stageY + 284, 320, 64, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Ghi nhớ SGK Tin học 10 (Trang 69)', panelX + 36, stageY + 310);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Kéo nút tròn trên hình để trực tiếp thay đổi Rx, Ry.', panelX + 36, stageY + 332);
}

/**
 * SCENE 3: Circle & Ellipse (Rx, Ry, Start, End) + Watermelon Slice (Hình 13.1)
 */
function renderScene3Ellipse(
  ctx: CanvasRenderingContext2D,
  W: number,
  stageY: number,
  stageH: number,
  p: number,
  t: number
) {
  const cx = W / 2 - 130;
  const cy = stageY + stageH / 2;

  // Phase A (0 - 40%): Ellipse Rx, Ry
  // Phase B (40% - 100%): Start & End morphing into Watermelon slice (Hình 13.1)
  const isSlicePhase = p > 0.38;
  const sliceProgress = Math.max(0, Math.min(1, (p - 0.38) / 0.55));

  ctx.save();

  if (!isSlicePhase) {
    // Ellipse Phase: pulsating Rx and Ry
    const rx = 180 + Math.sin(t * 3) * 30;
    const ry = 110 + Math.cos(t * 3) * 25;

    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Horizontal radius arrow Rx
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rx, cy);
    ctx.stroke();
    drawArrowHead(ctx, cx + rx, cy, 0);

    ctx.fillStyle = '#34d399';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(`Rx = ${Math.round(rx)} px (Ngang)`, cx + 20, cy - 10);

    // Vertical radius arrow Ry
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - ry);
    ctx.stroke();
    drawArrowHead(ctx, cx, cy - ry, -Math.PI / 2);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Ry = ${Math.round(ry)} px (Thẳng đứng)`, cx + 12, cy - ry / 2);

    // Center pivot node
    drawNodeHandle(ctx, cx, cy, 'circle', '#ffffff');
    drawNodeHandle(ctx, cx + rx, cy, 'square', '#10b981');
    drawNodeHandle(ctx, cx, cy - ry, 'square', '#38bdf8');
  } else {
    // Slicing phase: Start angle transforms from 0 -> 180°, End angle = 360°
    // Creating the classic SGK Watermelon Slice (Hình 13.1)!
    const startDeg = 180;
    const endDeg = 360;
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const baseR = 190;

    // Draw layered watermelon slice!
    // Layer 1: Green outer rind
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, baseR, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Layer 2: Light green / white rind
    ctx.fillStyle = '#bbf7d0';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, baseR * 0.92, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Layer 3: Juicy Red Flesh
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, baseR * 0.85, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Layer 4: Teardrop Seeds (Hình 13.1)
    const seedAngles = [0.25, 0.4, 0.55, 0.7, 0.85, 0.35, 0.65];
    const seedDists = [0.6, 0.55, 0.65, 0.55, 0.6, 0.35, 0.35];

    seedAngles.forEach((ratio, i) => {
      const angle = ratio * Math.PI;
      const dist = baseR * seedDists[i];
      const sx = cx + Math.cos(angle) * dist;
      const sy = cy + Math.sin(angle) * dist;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle - Math.PI / 2);
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Start / End node handles
    drawNodeHandle(ctx, cx + baseR, cy, 'circle', '#fbbf24');
    drawNodeHandle(ctx, cx - baseR, cy, 'circle', '#fbbf24');

    // Angle indicator annotation
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, baseR + 25, 0, Math.PI, false);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Start = 0° (hoặc 180°) | End = 180° (360°)', cx, cy + baseR + 48);
    ctx.fillText('➔ Tạo hình quạt (Miếng dưa hấu Hình 13.1 SGK)', cx, cy + baseR + 72);
  }

  ctx.restore();

  // Right Side Concept Deck
  const panelX = W - 420;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  roundRect(ctx, panelX, stageY + 20, 360, stageH - 40, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillText('HÌNH TRÒN & HÌNH ELIP', panelX + 24, stageY + 56);

  // Property 1: Rx, Ry
  const activeRadii = !isSlicePhase;
  ctx.fillStyle = activeRadii ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = activeRadii ? '#10b981' : 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, panelX + 20, stageY + 80, 320, 72, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeRadii ? '#6ee7b7' : '#94a3b8';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('Rx, Ry: Bán kính Elip', panelX + 36, stageY + 108);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Phương ngang (Rx) và phương đứng (Ry)', panelX + 36, stageY + 132);

  // Property 2: Start, End
  const activeAngles = isSlicePhase;
  ctx.fillStyle = activeAngles ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = activeAngles ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, panelX + 20, stageY + 168, 320, 96, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = activeAngles ? '#fcd34d' : '#94a3b8';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('Start, End: Góc điểm đầu & cuối', panelX + 36, stageY + 196);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Đơn vị: Độ (°)', panelX + 36, stageY + 220);
  ctx.fillText('Tạo hình quạt (segment) hoặc cung mở (arc)', panelX + 36, stageY + 244);

  // Watermelon Callout
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#ef4444';
  roundRect(ctx, panelX + 20, stageY + 280, 320, 72, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fca5a5';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Mô phỏng Hình 13.1 SGK Trang 69', panelX + 36, stageY + 306);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Miếng dưa hấu ghép từ các hình quạt xếp lớp', panelX + 36, stageY + 328);
}

/**
 * SCENE 4: Star & Polygon (Corners, Rounded, Spoke ratio, Randomized)
 */
function renderScene4StarPolygon(
  ctx: CanvasRenderingContext2D,
  W: number,
  stageY: number,
  stageH: number,
  p: number,
  t: number
) {
  const cx = W / 2 - 130;
  const cy = stageY + stageH / 2;

  // Progression:
  // 0 - 30%: Corners (5 -> 6 -> 8 -> 5) & Spoke ratio
  // 30 - 75%: Rounded (0 -> 0.45) -> Turning sharp star into round flower (Hình 13.2 SGK)
  // 75 - 100%: Randomized
  const isRoundedPhase = p > 0.3;
  const isRandomPhase = p > 0.75;

  let corners = 5;
  let spokeRatio = 0.45;
  let rounded = 0;
  let randomized = 0;

  if (p <= 0.3) {
    const cycle = Math.floor(t * 1.5) % 3;
    corners = cycle === 0 ? 5 : cycle === 1 ? 6 : 8;
    spokeRatio = 0.35 + Math.sin(t * 2) * 0.15;
  } else if (!isRandomPhase) {
    corners = 5;
    spokeRatio = 0.45;
    // Morph from sharp 0.0 to curved flower 0.42
    const rp = (p - 0.3) / 0.45;
    rounded = rp * 0.42;
  } else {
    corners = 5;
    spokeRatio = 0.45;
    rounded = 0.35;
    randomized = 0.12;
  }

  // Draw Star / Polygon
  ctx.save();
  ctx.fillStyle = isRoundedPhase ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.25)';
  ctx.strokeStyle = isRoundedPhase ? '#ef4444' : '#f59e0b';
  ctx.lineWidth = 4;

  drawStarPath(ctx, cx, cy, corners, 150, 150 * spokeRatio, rounded, randomized);
  ctx.fill();
  ctx.stroke();

  // Inkscape Nodes
  drawNodeHandle(ctx, cx, cy - 150, 'square', '#fbbf24');
  drawNodeHandle(ctx, cx + 45, cy - 50, 'circle', '#f87171');

  ctx.restore();

  // Right Side Concept Deck
  const panelX = W - 420;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  roundRect(ctx, panelX, stageY + 10, 360, stageH - 20, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillText('ĐA GIÁC & NGÔI SAO (TRANG 70)', panelX + 24, stageY + 42);

  // 4 Properties Table
  const properties = [
    {
      name: 'Corners',
      val: `${corners} cánh/đỉnh`,
      desc: 'Số đỉnh đa giác hoặc số cánh hình sao',
      active: p <= 0.3
    },
    {
      name: 'Spoke ratio',
      val: spokeRatio.toFixed(2),
      desc: 'Tỉ lệ bán kính từ tâm đến góc trong và đỉnh',
      active: p <= 0.3
    },
    {
      name: 'Rounded',
      val: rounded.toFixed(2),
      desc: 'Độ cong tại các đỉnh (Làm tròn cánh sao)',
      active: isRoundedPhase && !isRandomPhase,
      highlight: true
    },
    {
      name: 'Randomized',
      val: randomized.toFixed(2),
      desc: 'Tham số làm méo hình ngẫu nhiên',
      active: isRandomPhase
    }
  ];

  properties.forEach((prop, i) => {
    const py = stageY + 62 + i * 68;
    ctx.fillStyle = prop.active
      ? prop.highlight
        ? 'rgba(239, 68, 68, 0.25)'
        : 'rgba(245, 158, 11, 0.2)'
      : 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = prop.active
      ? prop.highlight
        ? '#ef4444'
        : '#f59e0b'
      : 'rgba(255, 255, 255, 0.08)';

    roundRect(ctx, panelX + 20, py, 320, 60, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = prop.active ? '#ffffff' : '#cbd5e1';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText(prop.name, panelX + 34, py + 26);

    ctx.fillStyle = prop.active ? (prop.highlight ? '#fca5a5' : '#fde047') : '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText(prop.val, panelX + 324, py + 26);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(prop.desc, panelX + 34, py + 48);
  });

  // Question Callout from SGK Page 70
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.strokeStyle = '#0ea5e9';
  roundRect(ctx, panelX + 20, stageY + 340, 320, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#7dd3fc';
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Câu hỏi SGK trang 70:', panelX + 32, stageY + 360);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Để đỉnh sao trở nên cong ➔ Thay đổi tham số Rounded!', panelX + 32, stageY + 378);
}

/**
 * SCENE 5: Outro & Summary Celebration
 */
function renderScene5Outro(
  ctx: CanvasRenderingContext2D,
  W: number,
  stageY: number,
  stageH: number,
  p: number,
  t: number
) {
  const cx = W / 2;
  const cy = stageY + stageH / 2;

  // Celebration Composition: The 3 Shapes orbiting harmoniously
  const orbitR = 160;
  const shapes = [
    { color: '#3b82f6', label: 'Hình chữ nhật', sub: 'W, H, Rx, Ry' },
    { color: '#10b981', label: 'Hình elip', sub: 'Rx, Ry, Start, End' },
    { color: '#f59e0b', label: 'Ngôi sao / Đa giác', sub: 'Corners, Rounded...' }
  ];

  shapes.forEach((s, i) => {
    const angle = (i * (2 * Math.PI) / 3) + t * 0.8;
    const sx = cx + Math.cos(angle) * orbitR;
    const sy = cy + Math.sin(angle) * (orbitR * 0.6);

    ctx.save();
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.85;

    if (i === 0) {
      roundRect(ctx, sx - 45, sy - 30, 90, 60, 12);
      ctx.fill();
    } else if (i === 1) {
      ctx.beginPath();
      ctx.ellipse(sx, sy, 45, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStarPath(ctx, sx, sy, 5, 45, 20, 0.2, 0);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.label, sx, sy + 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText(s.sub, sx, sy + 66);
    ctx.textAlign = 'left';

    ctx.restore();
  });

  // Center Emblem
  ctx.save();
  ctx.fillStyle = 'rgba(124, 58, 237, 0.25)';
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 75, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LÀM CHỦ', cx, cy - 10);
  ctx.fillStyle = '#c4b5fd';
  ctx.font = '700 15px "Outfit", sans-serif';
  ctx.fillText('HÌNH KHỐI', cx, cy + 14);

  ctx.fillStyle = '#a78bfa';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('INKSCAPE BÀI 13', cx, cy + 34);
  ctx.textAlign = 'left';
  ctx.restore();
}

/**
 * Procedural Star & Rounded Polygon generator
 */
function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  points: number,
  outerR: number,
  innerR: number,
  rounded: number = 0,
  randomized: number = 0
) {
  const totalVertices = points * 2;
  const coords: { x: number; y: number }[] = [];

  for (let i = 0; i < totalVertices; i++) {
    const isOuter = i % 2 === 0;
    let r = isOuter ? outerR : innerR;

    if (randomized > 0) {
      const pseudoRandom = Math.sin(i * 997 + points * 31) * randomized;
      r *= 1 + pseudoRandom;
    }

    const angle = (i * Math.PI) / points - Math.PI / 2;
    coords.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r
    });
  }

  ctx.beginPath();
  if (rounded <= 0.01) {
    // Sharp points
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.closePath();
  } else {
    // Rounded bezier curves matching Inkscape's Rounded parameter!
    const n = coords.length;
    ctx.moveTo((coords[0].x + coords[1].x) / 2, (coords[0].y + coords[1].y) / 2);

    for (let i = 0; i < n; i++) {
      const curr = coords[i];
      const next = coords[(i + 1) % n];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;

      // Tension control via rounded parameter
      ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
    }
    ctx.closePath();
  }
}

function drawNodeHandle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'square' | 'circle',
  color: string = '#ffffff'
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;

  if (type === 'square') {
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.strokeRect(x - 5, y - 5, 10, 10);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  const size = 7;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, -size / 2);
  ctx.lineTo(-size, size / 2);
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.restore();
}
