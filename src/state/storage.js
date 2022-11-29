import SecureLS from "secure-ls";

const secureLS = new SecureLS();

const setItem = (key, value) => {
  secureLS.set(key, JSON.stringify(value));
};

const getItem = (key) => {
  const storedState = secureLS.get(key);
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
