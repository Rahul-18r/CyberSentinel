import * as tf from '@tensorflow/tfjs-node';

// Refined thresholds based on known deepfake characteristics
const DETECTION_THRESHOLDS = {
  EYE_VERTICAL_DIFF: 0.002,      // Very small eye level difference is suspicious
  EYE_SPACING: 0.09,             // Unnatural eye spacing threshold
  MOUTH_SYMMETRY: 0.001,         // Perfect symmetry is suspicious
  FACIAL_PROPORTION_MIN: 0.15,    // Natural proportion minimums
  FACIAL_PROPORTION_MAX: 0.35     // Natural proportion maximums
};

export function analyzeFacialFeatures(features) {
  const anomalies = [];
  let anomalyScore = 0;

  // 1. Check eye alignment and spacing
  const eyeVerticalDiff = Math.abs(features.left_eye.y - features.right_eye.y);
  const eyeHorizontalDiff = Math.abs(features.left_eye.x - features.right_eye.x);
  
  if (eyeVerticalDiff < DETECTION_THRESHOLDS.EYE_VERTICAL_DIFF) {
    anomalies.push('Suspiciously perfect eye alignment');
    anomalyScore += 0.3;
  }

  // 2. Check mouth symmetry (perfect symmetry is suspicious)
  const mouthVerticalDiff = Math.abs(features.left_mouth_corner.y - features.right_mouth_corner.y);
  if (mouthVerticalDiff < DETECTION_THRESHOLDS.MOUTH_SYMMETRY) {
    anomalies.push('Unnaturally perfect mouth symmetry');
    anomalyScore += 0.35;
  }

  // 3. Analyze facial proportions
  const faceHeight = features.y2 - features.y1;
  const eyeToNoseRatio = (features.nose_tip.y - features.left_eye.y) / faceHeight;
  const noseToMouthRatio = (features.left_mouth_corner.y - features.nose_tip.y) / faceHeight;

  if (eyeToNoseRatio < DETECTION_THRESHOLDS.FACIAL_PROPORTION_MIN ||
      eyeToNoseRatio > DETECTION_THRESHOLDS.FACIAL_PROPORTION_MAX) {
    anomalies.push('Unnatural eye-to-nose proportion');
    anomalyScore += 0.25;
  }

  return {
    isDeepfake: anomalyScore >= 0.6,
    confidence: anomalyScore * 100,
    anomalies,
    metrics: {
      eyeVerticalAlignment: eyeVerticalDiff,
      mouthSymmetry: mouthVerticalDiff,
      proportions: {
        eyeToNose: eyeToNoseRatio,
        noseToMouth: noseToMouthRatio
      }
    }
  };
}