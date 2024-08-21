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
  const m = new Date(myd);
  let month = m.getMonth() + 1;
  const day = m.getDate();
  const year = m.getFullYear();

  // Add leading zero to month if less than 10
  if (month < 10) {
    month = `0${month}`;
  }

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};
