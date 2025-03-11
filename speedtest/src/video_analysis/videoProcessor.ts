import fs from 'fs';
import cv2 from 'opencv4nodejs';
import path from 'path';

export class VideoProcessor {
  private videoPath: string;
  private outputFolder: string;
  private fps: number;
  private frameInterval: number;

  constructor(videoPath: string, outputFolder: string, intervalSec = 0.05) {
    this.videoPath = videoPath;
    this.outputFolder = outputFolder;

    const cap = new cv2.VideoCapture(videoPath);
    this.fps = cap.get(cv2.CAP_PROP_FPS);
    this.frameInterval = Math.max(Math.floor(this.fps * intervalSec), 1);

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
  }

  async extractFrames(): Promise<string[]> {
    const cap = new cv2.VideoCapture(this.videoPath);
    const frameFiles: string[] = [];
    let frameCount = 0;

    while (true) {
      const frame = cap.read();
      if (frame.empty) break;

      if (frameCount % this.frameInterval === 0) {
        const filename = path.join(
          this.outputFolder,
          `frame_${(frameCount / this.fps).toFixed(2)}.jpg`,
        );
        cv2.imwrite(filename, frame);
        frameFiles.push(filename);
      }

      frameCount++;
    }

    cap.release();
    return frameFiles;
  }
}
