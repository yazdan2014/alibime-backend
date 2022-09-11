export default {
  getUsers(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .getAllUsers(data)
        .then(result => {
          const users = result;
          vuexContext.commit("getsAllUsers", users);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
};
