import cv2 from "opencv4nodejs";

export class SpinnerDetector {
  private spinnerTemplate: cv2.Mat;
  private threshold: number;

  constructor(spinnerImagePath: string, threshold = 0.9) {
    this.spinnerTemplate = cv2.imread(spinnerImagePath);
    this.threshold = threshold;
  }

  detectSpinner(framePath: string): boolean {
    const frame = cv2.imread(framePath);
    if (frame.empty) return false;

    const result = frame.matchTemplate(
      this.spinnerTemplate,
      cv2.TM_CCOEFF_NORMED
    );
    const minMax = result.minMaxLoc();
    return minMax.maxVal > this.threshold;
  }
}
