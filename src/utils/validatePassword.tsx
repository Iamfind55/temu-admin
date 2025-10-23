// import { IPasswordValidationResult } from "@/types/profile";

export function validatePassword(password: string): any {
// export function validatePassword(password: string): IPasswordValidationResult {
  // Conditions to check
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberSymbolOrWhitespace = /[\d\s\W]/.test(password);
  const isLongEnough = password.length >= 8;

  // Combine conditions to check if the password is valid
  const isValid = hasUppercase && hasNumberSymbolOrWhitespace && isLongEnough;

  // Return object showing each condition
  return {
    isValid,
    hasUppercase,
    hasNumberSymbolOrWhitespace,
    isLongEnough,
  };
}
