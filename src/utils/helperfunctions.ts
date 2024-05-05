

export const getDate = (myd) => {
    const m = new Date(myd)
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
  const seconds = now.getSeconds()
  const formattedtime = `${hour}:${minute}`
  return formattedtime;
  }