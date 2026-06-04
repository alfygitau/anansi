import { useCallback } from "react";

export function useFormattedDateTime() {
  const formatDateTime = useCallback((date) => {
    if (!date) return "Invalid date";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date"; // `.getTime()` safely checks validity

    // Date formatting
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    // Time formatting (12-hour clock)
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");

    return `${month}/${day}/${year} ${strHours}:${minutes} ${ampm}`;
  }, []);

  return formatDateTime;
}