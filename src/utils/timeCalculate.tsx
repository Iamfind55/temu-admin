export const calculateCustomTimeSlots = (
  startTime: string,
  endTime: string,
  durationInMinutes: number // Now this represents minutes instead of just hours
) => {
  const convertTo24Hour = (time: string) => {
    const [hourMinute, modifier] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":").map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  };

  const timeToString = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHour = hours % 12 || 12;
    return `${adjustedHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const addMinutes = (hours: number, minutes: number, duration: number) => {
    const totalMinutes = hours * 60 + minutes + duration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return { hours: newHours, minutes: newMinutes };
  };

  const start = convertTo24Hour(startTime);
  const end = convertTo24Hour(endTime);

  const slots = [];
  let currentHour = start.hours;
  let currentMinute = start.minutes;

  while (
    currentHour < end.hours ||
    (currentHour === end.hours && currentMinute < end.minutes)
  ) {
    const { hours: nextHour, minutes: nextMinute } = addMinutes(
      currentHour,
      currentMinute,
      durationInMinutes
    );

    // If the next time exceeds the end time, stop
    if (
      nextHour > end.hours ||
      (nextHour === end.hours && nextMinute > end.minutes)
    ) {
      break;
    }

    slots.push({
      label: `${timeToString(currentHour, currentMinute)} - ${timeToString(
        nextHour,
        nextMinute
      )}`,
      value: `${Math.floor(durationInMinutes / 60)}h ${
        durationInMinutes % 60
      }mn`
        .replace("0h ", "") // Only show hours if > 0
        .trim(),
    });

    // Move the current time forward by the duration
    currentHour = nextHour;
    currentMinute = nextMinute;
  }

  return slots;
};

export const convertTo24HourFormat = (time: string) => {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// (formatTime(45));   Output: "45m" && (formatTime(70));   Output: "1h 10m"
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes} m`;
  }
}
