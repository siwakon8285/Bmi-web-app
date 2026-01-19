export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) return 0;
  // Convert height from cm to meters if needed (assuming input might be in cm)
  const heightInMeters = height > 3 ? height / 100 : height;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'ผอม (Underweight)';
  if (bmi < 25) return 'ปกติ (Normal)';
  if (bmi < 30) return 'ท้วม (Overweight)';
  return 'อ้วน (Obesity)';
}

export function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return 'text-blue-500';
  if (bmi < 25) return 'text-green-500';
  if (bmi < 30) return 'text-yellow-500';
  return 'text-red-500';
}
