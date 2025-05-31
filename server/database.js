export const users = new Map();

export const storeUser = (username, userData) => {
  users.set(username, userData);
};

export const getUser = (username) => {
  return users.get(username);
};