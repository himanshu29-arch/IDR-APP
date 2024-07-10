export function formatDate(dateStr) {
  const date = new Date(dateStr);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}
