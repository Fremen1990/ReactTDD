const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const storedState = localStorage.getItem(key);
  if (!storedState) {
    return null;
  }
  try {
    return JSON.parse(storedState);
  } catch (e) {
    return storedState;
  }
};

const clear = () => {
  localStorage.clear();
};

const storage = {
  getItem,
  setItem,
  clear,
};

export default storage;
