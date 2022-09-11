export const store = {
  state: {
    info: {},
    fullName: ""
  },
  setInfo(newValue) {
    return (this.state.info = newValue);
  },
  setFullName(newValue) {
    return (this.state.fullName = newValue);
  }
};
