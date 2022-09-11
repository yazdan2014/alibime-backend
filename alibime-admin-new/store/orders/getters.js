export default {
  getOrders(state) {
    return state.orders;
  },
  getOrderById: state => id => {
    return state.orders.find(item => {
      return item._id === id;
    });
  }
};
