export const countStatuses = (workOrderData) => {
  // Initialize counts
  let counts = {
    Open: 0,
    Design: 0,
    InProgress: 0,
    Reviewing: 0,
    Closed: 0,
  };

  // Count statuses
  workOrderData.forEach((item) => {
    switch (item.status) {
      case "Open":
        counts.Open++;
        break;
      case "Design":
        counts.Design++;
        break;
      case "In Progress":
        counts.InProgress++;
        break;
      case "Reviewing":
        counts.Reviewing++;
        break;
      case "Project Completed":
        counts.Closed++;
        break;
      case "Closed":
        counts.Closed++;
        break;
      default:
        break;
    }
  });

  return counts;
};
