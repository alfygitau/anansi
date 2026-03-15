import { useCallback } from "react";

export function useFormattedDate() {
  const formatDate = useCallback((date) => {
    if (!date) return "Invalid date";

    const d = new Date(date);
    if (isNaN(d)) return "Invalid date";

    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  }, []);

  return formatDate;
}
