const reducer = (state, action) => {
  if (action.type === "login-success") {
    const newState = { ...state };
    newState.id = action.payload.id;
    newState.isLoggedIn = true;
    return newState;
  }
  // console.log({ state, action });
  return state;
};

export default reducer;
