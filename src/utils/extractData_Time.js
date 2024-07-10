export function extractDateAndTime(timestamp) {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Extract month (0-indexed)
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // Extract day
  const day = String(date.getDate()).padStart(2, "0");

  // Extract year
  const year = date.getFullYear();

  // Extract hours (12-hour format) with leading zero
  const hours = String(date.getHours() % 12).padStart(2, "0");

  // Extract minutes
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM/PM
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  // Format the date and time
  const formattedDate = `${month}-${day}-${year}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // Return an object with extracted values
  return {
    date: formattedDate,
    time: formattedTime,
  };
}
