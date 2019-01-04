export function getGameId(date) {
  const now = date ? new Date(date) : new Date();
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
