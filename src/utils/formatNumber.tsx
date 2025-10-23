// 45000.00 -> 45,000.00
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// 09:30:00 -> 09:30
export function removeSeconds(time: string): string {
  return time.endsWith(":00") ? time.slice(0, -3) : time;
}


// console.log(formatNumber(aa));   // Outputs: "23,424"
// console.log(formatNumber(bb));   // Outputs: "24,534"
export const formatStringAndNumber = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return "0";
  const numString = String(value).replace(/,/g, '');
  const number = parseFloat(numString);
  if (isNaN(number)) return "0";
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 0
  });
};