/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Film,
  Sliders,
  BookOpen,
  HelpCircle,
  Maximize2,
  Minimize2,
  FastForward,
  Rewind
} from 'lucide-react';
import { SCENES, TOTAL_DURATION, Scene } from './types/video';
import { VideoCanvas } from './components/VideoCanvas';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { TextbookReference } from './components/TextbookReference';
import { QuickQuiz } from './components/QuickQuiz';
import { audioEngine } from './utils/audioEngine';
import { videoExporter, ExportProgress } from './utils/videoExporter';

export default function App() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'sandbox' | 'textbook' | 'quiz'>('video');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControlsHint, setShowControlsHint] = useState<boolean>(false);

  // Video Export state
  const [exportState, setExportState] = useState<ExportProgress>({
    isRecording: false,
    progressPercent: 0,
    currentSecond: 0,
    downloadUrl: null
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Current Scene
  const currentScene =
    SCENES.find((s) => currentTime >= s.startTime && currentTime <= s.endTime) ||
    SCENES[SCENES.length - 1];

  // Video Playback Loop (Synced with 60fps requestAnimationFrame)
  useEffect(() => {
    if (isPlaying) {
      audioEngine.startMusic();
      lastTimestampRef.current = performance.now();

      const loop = (now: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = now;
        const deltaSec = (now - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            audioEngine.stopMusic();
            return TOTAL_DURATION;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      audioEngine.stopMusic();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimestampRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    audioEngine.init();

    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      audioEngine.resetSceneTrigger();
    }
    setIsPlaying(!isPlaying);
    // Flash play hint on mobile
    setShowControlsHint(true);
    setTimeout(() => setShowControlsHint(false), 900);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    audioEngine.resetSceneTrigger();
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, newTime));
    setCurrentTime(clamped);
    audioEngine.resetSceneTrigger();
  };

  const skipSeconds = (seconds: number) => {
    handleSeek(currentTime + seconds);
    audioEngine.playParameterTick(seconds > 0 ? 580 : 380);
  };

  const handleJumpToScene = (scene: Scene) => {
    handleSeek(scene.startTime);
    audioEngine.playTransitionChime();
  };

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {
        setIsFullscreen(!isFullscreen);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Video Export Handler
  const handleExportVideo = async () => {
    if (!canvasRef.current) return;
    setIsPlaying(false);
    audioEngine.stopMusic();

    try {
      await videoExporter.export45SecVideo(
        canvasRef.current,
        audioEngine.getAudioDestinationNode(),
        audioEngine.getAudioContext(),
        (prog) => setExportState(prog),
        (seekTime) => setCurrentTime(seekTime)
      );
    } catch {
      // Handled in exporter
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pb-20 md:pb-0 selection:bg-blue-600 selection:text-white">
      {/* 1. TOP APP BAR: Compact, Responsive, Mobile Optimized */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-8">
          {/* Brand zone */}
          <a
            href="/"
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md">
              IN
            </div>
            <span className="truncate max-w-[180px] sm:max-w-none">
              Tin Học 10 · Bài 13
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('video')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'video' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Video Bài Giảng (45s)
            </button>
            <button
              onClick={() => {
                setActiveTab('sandbox');
                document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'sandbox' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Phòng Thực Hành
            </button>
            <button
              onClick={() => {
                setActiveTab('textbook');
                document.getElementById('textbook-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'textbook' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Bảng SGK Trang 69-70
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'quiz' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Trắc Nghiệm
            </button>
          </nav>

          {/* Primary Action Button: Export Video */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportVideo}
              disabled={exportState.isRecording}
              className="min-h-[40px] px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {exportState.isRecording
                  ? `Đang xuất ${exportState.progressPercent}%`
                  : 'Xuất Video 45s'}
              </span>
              <span className="sm:hidden">
                {exportState.isRecording ? `${exportState.progressPercent}%` : 'Tải Video'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 sm:space-y-12">
        {/* HERO SECTION: The 45-Second Mobile-Ready Video Player */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-blue-400 font-semibold">
                <span>BÀI 13 · TIN HỌC 10</span>
                <span aria-hidden="true">·</span>
                <span>KẾT NỐI TRI THỨC</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-mono">45 GIÂY</span>
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 sm:mt-2 tracking-tight">
                Các Đối Tượng Hình Khối & Thuộc Tính
              </h1>
            </div>

            {/* Quick Export / Download notice */}
            {exportState.downloadUrl && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
                <span>Video đã xuất xong!</span>
                <a
                  href={exportState.downloadUrl}
                  download="Bai13_Cac_Doi_Tuong_Hinh_Khoi_45s.webm"
                  className="underline font-bold hover:text-white ml-1"
                >
                  Tải file (.webm)
                </a>
              </div>
            )}
          </div>

          {/* 16:9 Video Player Viewport with Mobile Tap-to-Play */}
          <div
            ref={videoContainerRef}
            className={`relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen flex items-center justify-center' : ''
            }`}
          >
            {/* The Canvas */}
            <div
              className="relative w-full cursor-pointer select-none"
              onClick={togglePlay}
            >
              <VideoCanvas
                currentTime={currentTime}
                isPlaying={isPlaying}
                onCanvasRef={(canvas) => {
                  canvasRef.current = canvas;
                }}
              />

              {/* Tap feedback indicator */}
              {showControlsHint && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white scale-110 animate-fade-out">
                    {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="absolute top-3 right-3 min-w-[36px] min-h-[36px] bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white flex items-center justify-center z-10 transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Overlay if recording */}
            {exportState.isRecording && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl z-30 p-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-white text-center">
                  Đang ghi video 45 giây...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Khung hình {exportState.currentSecond}s / 45s ({exportState.progressPercent}%)
                </p>
                <div className="w-56 sm:w-64 h-2.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-150"
                    style={{ width: `${exportState.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED SUBTITLE & PROPERTY BANNER */}
          <div className="bg-slate-950/90 rounded-xl border border-slate-800/90 p-3 sm:p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                style={{
                  backgroundColor: `${currentScene.accentColor}25`,
                  color: currentScene.accentColor,
                  border: `1px solid ${currentScene.accentColor}50`
                }}
              >
                {currentScene.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Cảnh 0{currentScene.id} / 05
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
              &ldquo;{currentScene.script}&rdquo;
            </p>

            {/* Key property chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentScene.keyProperties.map((p, idx) => (
                <div
                  key={idx}
                  className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300 font-mono"
                >
                  <strong className="text-white">{p.name}:</strong> {p.meaning}
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE-ERGONOMIC CONTROLS DECK */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-3 sm:p-5 shadow-xl space-y-3 sm:space-y-4">
            {/* Scrubber Bar (Thick touch track for thumbs) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-white font-bold text-sm">
                  {Math.floor(currentTime / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, '0')}
                  .{(Math.floor(currentTime * 10) % 10).toString()}
                </span>
                <span className="text-slate-500 text-[11px]">00:45.0 (Tổng độ dài)</span>
              </div>

              <input
                type="range"
                min={0}
                max={TOTAL_DURATION}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all touch-action-none"
              />
            </div>

            {/* Playback Controls Row - Thumb target >= 44px */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              {/* Left: Rewind 5s, Play/Pause, Forward 5s */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => skipSeconds(-5)}
                  className="min-w-[44px] min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                  title="Lùi 5 giây"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="min-w-[48px] min-h-[44px] px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span className="hidden sm:inline">Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span className="hidden sm:inline">
                        {currentTime >= TOTAL_DURATION ? 'Xem lại' : 'Phát'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => skipSeconds(5)}
                  className="min-w-[44px] min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                  title="Tua tới 5 giây"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRestart}
                  title="Bắt đầu lại"
                  className="min-w-[44px] min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Sound Controls & Speed */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className={`min-w-[44px] min-h-[44px] rounded-xl text-xs flex items-center justify-center transition-colors ${
                    isMuted
                      ? 'bg-red-950/60 text-red-400 border border-red-800'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title={isMuted ? 'Bật âm thanh nền' : 'Tắt âm thanh nền'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Speed buttons */}
                <div className="hidden sm:flex items-center gap-0.5 p-1 bg-slate-900 rounded-xl text-xs font-mono">
                  {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        playbackSpeed === speed
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Horizontal Scrollable Scene Jumpers for Mobile Swiping */}
            <div className="pt-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                  Cảnh:
                </span>
                {SCENES.map((scene) => {
                  const isActive = currentScene.id === scene.id;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => handleJumpToScene(scene)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: scene.accentColor }}
                      />
                      <span className="font-mono text-[11px] text-slate-400">
                        0{scene.id}
                      </span>
                      <span>{scene.title.split(' ')[0]} {scene.title.split(' ')[1] || ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Interactive Sandbox */}
        <section id="sandbox-section">
          <InteractiveSandbox />
        </section>

        {/* SECTION 3: Official Textbook Reference & Scan Inspector */}
        <section id="textbook-section">
          <TextbookReference />
        </section>

        {/* SECTION 4: Quick Quiz */}
        <section id="quiz-section">
          <QuickQuiz />
        </section>
      </main>

      {/* QUIET EDUCATIONAL FOOTER */}
      <footer className="mt-12 sm:mt-16 border-t border-slate-800 bg-slate-950 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            <span>Bài 13: Bổ sung các đối tượng đồ họa · Tin học 10 Kết nối tri thức</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span className="block sm:inline mt-1 sm:mt-0">Tối ưu hoàn hảo cho điện thoại di động & máy tính</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-slate-300 transition-colors py-1"
          >
            Lên đầu trang ↑
          </button>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION ANCHOR (Pattern 1: Fixed Bottom Tab Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe md:hidden">
        <div className="grid grid-cols-4 items-center h-16">
          <button
            onClick={() => {
              setActiveTab('video');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center h-full active:scale-95 transition-transform ${
              activeTab === 'video' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Video 45s</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sandbox');
              document.getElementById('sandbox-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center h-full active:scale-95 transition-transform ${
              activeTab === 'sandbox' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Thực hành</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('textbook');
              document.getElementById('textbook-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center h-full active:scale-95 transition-transform ${
              activeTab === 'textbook' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Sách GK</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center h-full active:scale-95 transition-transform ${
              activeTab === 'quiz' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Trắc nghiệm</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
