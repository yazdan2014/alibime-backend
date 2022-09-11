export default {
  getsAllAdmins(state, admin) {
    state.state = admin;
  },
  addNewAdmin(state, admin) {
    orderFixes([admin]);
    state.state.push(admin);
  }
};

function orderFixes(orders, rootState) {
  orders.forEach(element => {});
}
