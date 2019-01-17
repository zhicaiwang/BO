export function getGameId(date) {
  const now = date ? new Date(date) : getCurrentTimeInUTC8();
  return +`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
}

export function getHistoryGameId() {
  const now = new Date();
  let gameIds = [];
  for (let i = 0; i < 5; i++) {
    gameIds.push(getGameId(now.getTime() - (i * 24 * 60 * 60 * 1000)));
  }
  return gameIds;
}

export function getStartTime() {
  const now = getCurrentTimeInUTC8();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return new Date(`${year}/${month}/${day} 12:00:00`).getTime();
}

export function getEndTime() {
  const now = getCurrentTimeInUTC8();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return new Date(`${year}/${month}/${day} 24:00:00`).getTime();
}

export function getCurrentTimeInUTC8() {
  // create Date object for current location
      var d = new Date();
      // convert to msec
      // subtract local time zone offset
      // get UTC time in msec
      var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

      // create new Date object for different city
      // using supplied offset
      return new Date(utc + (3600000*8));
}
