import { pipeline } from '@xenova/transformers';

export class DeepfakeDetector {
  static detector = null;
  
  static async getInstance() {
    if (!this.detector) {
      this.detector = await pipeline('image-classification', 'Xenova/deepfake-detection-model');
    }
    return this.detector;
  }

  static async analyzeImage(imageElement) {
    try {
      const detector = await this.getInstance();
      const results = await detector(imageElement);
      
      // Convert confidence scores to our format
      return {
        isDeepfake: results[0].label === 'fake',
        confidence: results[0].score,
        aiScore: results[0].score
      };
    } catch (error) {
      console.error('AI Detection error:', error);
      return null;
    }
  }
}