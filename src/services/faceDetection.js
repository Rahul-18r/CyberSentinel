import * as faceapi from '@vladmandic/face-api';

export class FaceDetectionService {
  static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      const modelPath = '/models/face-api';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
      ]);
      
      this.isInitialized = true;
      console.log('Face detection models loaded successfully');
    } catch (err) {
      console.error('Error initializing face detection:', err);
      throw err;
    }
  }

  static async analyzeFace(imageElement) {
    try {
      await this.initialize();

      // Detect faces with landmarks and descriptors
      const detections = await faceapi
        .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!detections.length) {
        return {
          faceScore: 0.5,
          reason: 'No faces detected in image'
        };
      }

      // Analyze facial features
      const analysis = this.analyzeFacialFeatures(detections[0]);
      
      return {
        faceScore: analysis.score,
        reason: analysis.reason,
        landmarks: detections[0].landmarks.positions
      };
    } catch (err) {
      console.error('Face analysis error:', err);
      return {
        faceScore: 0.5,
        reason: 'Error analyzing facial features'
      };
    }
  }

  static analyzeFacialFeatures(detection) {
    const landmarks = detection.landmarks;
    const positions = landmarks.positions;
    
    // Calculate symmetry score
    const symmetryScore = this.calculateSymmetryScore(positions);
    
    // Calculate proportion score
    const proportionScore = this.calculateProportionScore(positions);
    
    // Calculate texture consistency score
    const textureScore = this.calculateTextureScore(detection);
    
    // Combine scores with weights
    const finalScore = (
      symmetryScore * 0.4 + 
      proportionScore * 0.4 + 
      textureScore * 0.2
    );

    return {
      score: finalScore,
      reason: this.getAnalysisReason(finalScore)
    };
  }

  static calculateSymmetryScore(positions) {
    const centerX = positions[27].x; // Nose bridge point
    const pairs = [
      [0, 16],  // Jaw
      [1, 15],
      [2, 14],
      [3, 13],
      [4, 12],
      [36, 45], // Eyes
      [31, 35]  // Nose
    ];

    const asymmetryScores = pairs.map(([left, right]) => {
      const leftPoint = positions[left];
      const rightPoint = positions[right];
      const leftDist = Math.abs(centerX - leftPoint.x);
      const rightDist = Math.abs(centerX - rightPoint.x);
      return Math.abs(leftDist - rightDist) / ((leftDist + rightDist) / 2);
    });

    const avgAsymmetry = asymmetryScores.reduce((a, b) => a + b) / asymmetryScores.length;
    return 1 - Math.min(avgAsymmetry, 1);
  }

  static calculateProportionScore(positions) {
    // Standard facial proportions
    const eyeDistance = this.getDistance(positions[36], positions[45]);
    const noseLength = this.getDistance(positions[27], positions[33]);
    const mouthWidth = this.getDistance(positions[48], positions[54]);
    
    // Check typical ratios
    const ratioScores = [
      this.checkRatio(eyeDistance / noseLength, 1.3, 0.2),
      this.checkRatio(mouthWidth / eyeDistance, 0.9, 0.15),
      this.checkRatio(noseLength / mouthWidth, 0.7, 0.15)
    ];

    return ratioScores.reduce((a, b) => a + b) / ratioScores.length;
  }

  static calculateTextureScore(detection) {
    // Simplified texture analysis
    // In a real implementation, you'd want to analyze the texture patterns
    // of the skin and look for inconsistencies
    return 0.8; // Default to slightly favorable score
  }

  static getDistance(p1, p2) {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + 
      Math.pow(p2.y - p1.y, 2)
    );
  }

  static checkRatio(ratio, target, tolerance) {
    const difference = Math.abs(ratio - target);
    return Math.max(0, 1 - (difference / tolerance));
  }

  static getAnalysisReason(score) {
    if (score > 0.8) return 'Facial features appear natural';
    if (score > 0.6) return 'Minor facial inconsistencies detected';
    if (score > 0.4) return 'Moderate facial anomalies detected';
    return 'Significant facial irregularities detected';
  }
}