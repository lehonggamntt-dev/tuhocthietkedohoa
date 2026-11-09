/**
 * Client-Side 45-Second Video Recording & Export Engine
 */

export interface ExportProgress {
  isRecording: boolean;
  progressPercent: number;
  currentSecond: number;
  downloadUrl: string | null;
  error?: string;
}

export class VideoExporter {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  public async export45SecVideo(
    canvas: HTMLCanvasElement,
    audioDestinationNode: AudioNode | null,
    audioContext: AudioContext | null,
    onProgress: (prog: ExportProgress) => void,
    onSeekTime: (time: number) => void
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        this.recordedChunks = [];

        // 1. Capture canvas video stream
        const canvasStream = canvas.captureStream(30);

        // 2. Audio track if available
        let combinedStream = canvasStream;
        if (audioContext && audioDestinationNode) {
          try {
            const dest = audioContext.createMediaStreamDestination();
            audioDestinationNode.connect(dest);
            const audioTrack = dest.stream.getAudioTracks()[0];
            if (audioTrack) {
              combinedStream.addTrack(audioTrack);
            }
          } catch {
            // Audio capture optional fallback
          }
        }

        // 3. Supported MIME types
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm;codecs=vp8';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }

        this.mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: 3_500_000
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          onProgress({
            isRecording: false,
            progressPercent: 100,
            currentSecond: 45,
            downloadUrl: url
          });

          // Trigger automated download
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Bai13_Cac_Doi_Tuong_Hinh_Khoi_45s.webm';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          resolve(url);
        };

        this.mediaRecorder.start(100);

        // Step through the 45 seconds at steady speed
        const totalDuration = 45.0;
        const fps = 30;
        const totalFrames = totalDuration * fps;
        let currentFrame = 0;

        const frameInterval = 1000 / fps;
        const timer = setInterval(() => {
          currentFrame++;
          const t = (currentFrame / totalFrames) * totalDuration;
          onSeekTime(t);

          const percent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
          onProgress({
            isRecording: true,
            progressPercent: percent,
            currentSecond: Math.round(t),
            downloadUrl: null
          });

          if (currentFrame >= totalFrames) {
            clearInterval(timer);
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
              this.mediaRecorder.stop();
            }
          }
        }, frameInterval);

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi xuất video';
        onProgress({
          isRecording: false,
          progressPercent: 0,
          currentSecond: 0,
          downloadUrl: null,
          error: message
        });
        reject(err);
      }
    });
  }

  public cancelExport() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}

export const videoExporter = new VideoExporter();
