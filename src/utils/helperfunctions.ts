export const getDate = (myd) => {
  const m = new Date(myd);
  const month = m.getMonth() + 1;
  const day = m.getDate();
  const year = m.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const timeFormatter = (data) => {
  const now = new Date(data);

  const hour = now.getHours();

  const minute = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedtime = `${hour}:${minute}`;
  return formattedtime;
};

export const getFormattedDate = (myd) => {
  console.log("🚀 ~ getFormattedDate ~ myd:", myd);
  const m = new Date(myd);
  let month = m.getMonth() + 1;
  let day = m.getDate();
  const year = m.getFullYear();
  const hours = m.getUTCHours().toString().padStart(2, "0");
  const minutes = m.getUTCMinutes().toString().padStart(2, "0");

  // Add leading zero to month if less than 10
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  const formattedDate = `${month}-${day}-${year} ${hours}:${minutes} `;
  console.log("🚀 ~ getFormattedDate ~ formattedDate:", formattedDate);
  return formattedDate;
};

export const getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};
