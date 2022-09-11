export default {
  getsAllOrders(state, orders) {
    state.orders = orders;
  },
  getOrderById(state, order) {
    state.orders = order;
  },
  getImageOrder(state, order) {
    state.orders = order;
  },
};
