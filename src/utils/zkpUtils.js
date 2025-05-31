import { ethers } from 'ethers';

export const generateProof = (pin) => {
  try {
    // Convert PIN to bytes and hash it
    const pinBytes = ethers.toUtf8Bytes(pin.toString());
    const hashedPin = ethers.keccak256(pinBytes);
    
    return {
      proof: hashedPin,
      success: true
    };
  } catch (error) {
    console.error('Error generating proof:', error);
    return {
      proof: null,
      success: false,
      error: error.message
    };
  }
};

export const verifyProof = (proof, pin) => {
  try {
    const pinBytes = ethers.toUtf8Bytes(pin.toString());
    const hashedPin = ethers.keccak256(pinBytes);
    return hashedPin === proof;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
};