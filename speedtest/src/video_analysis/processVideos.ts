import { VideoProcessor } from "./videoProcessor";
import { SpinnerDetector } from "./spinnerDetector";
import path from "path";

const telecoms = ["LG", "KT", "SKT"];
const pages = [
  "메인",
  "모바일요금제",
  "모바일서브메인",
  "혜택",
  "고객지원",
  "다이렉트샵",
];
const videoBasePath = "C:/Users/유닉솔루션(주)/Downloads/250218 APP";
const outputBasePath = "cv2/";

async function processVideos() {
  for (const telecom of telecoms) {
    for (const page of pages) {
      const videoPath = path.join(
        videoBasePath,
        `${telecom}/${telecom}_${page}_1.mp4`
      );
      const outputFolder = path.join(
        outputBasePath,
        `${telecom}/${telecom}_${page}`
      );

      console.log(`📼 Processing video: ${videoPath}`);
      const processor = new VideoProcessor(videoPath, outputFolder);
      const frames = await processor.extractFrames();

      const spinnerPath = path.join(
        outputBasePath,
        `${telecom}/${telecom}_${page}_로딩완료.jpg`
      );
      const detector = new SpinnerDetector(spinnerPath);

      for (const framePath of frames) {
        if (detector.detectSpinner(framePath)) {
          console.log(`✅ ${telecom} ${page} 로딩 완료: ${framePath}`);
          break;
        }
      }
    }
  }
}

processVideos();
