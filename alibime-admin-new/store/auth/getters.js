export default {
  isAuthenticated(state) {
    return state.token != null
  },
  getToken(state) {
    return state.token
  },
  getRole(state) {
    return state.role
  },
  isInfo(state) {
    return state.info != null
  },
  getInfo(state) {
    return state.info
  },
  getFullName(state) {
    let firstName = ''
    let lastName = ''
    if (typeof state.info !== 'undefined' && state.info !== null) {
      let name
      name = state.info.firstName
      firstName = String(
        typeof name !== 'undefined' && name !== 'undefined' ? name : ''
      )
      name = state.info.lastName
      lastName = String(
        typeof name !== 'undefined' && name !== 'undefined' ? name : ''
      )
    }

    return firstName + ' ' + lastName
  },
}
