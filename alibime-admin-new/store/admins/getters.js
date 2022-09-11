export default {
  getByUserName: (state) => (username) => {
    return state.admins.find((item) => {
      return item.username === username;
    });
  },
};
