/**
 * Haptic feedback utilities for mobile devices.
 * Uses navigator.vibrate() API with graceful fallback.
 */

// Check if vibration is supported
const isVibrationSupported = () =>
  typeof navigator !== 'undefined' && 'vibrate' in navigator;

// Light tap feedback (10ms)
export const hapticTap = () => {
  if (isVibrationSupported()) {
    navigator.vibrate(10);
  }
};

// Success feedback (short burst)
export const hapticSuccess = () => {
  if (isVibrationSupported()) {
    navigator.vibrate([30, 50, 30]);
  }
};

// Error feedback (longer, stronger)
export const hapticError = () => {
  if (isVibrationSupported()) {
    navigator.vibrate([50, 30, 50, 30, 50]);
  }
};

// Completion celebration (pattern)
export const hapticComplete = () => {
  if (isVibrationSupported()) {
    navigator.vibrate([20, 40, 20, 40, 60]);
  }
};

// Card flip feedback
export const hapticFlip = () => {
  if (isVibrationSupported()) {
    navigator.vibrate(15);
  }
};
