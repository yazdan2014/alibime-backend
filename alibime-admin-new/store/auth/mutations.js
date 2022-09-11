export default {
  setToken(state, token) {
    state.token = token
  },
  setRole(state, role) {
    state.role = role
  },
  setExpireToken(state, expireToken) {
    state.expireToken = expireToken
  },
  clearToken(state) {
    state.token = null
    state.expireToken = null
    state.role = ''
  },
  setInfo(state, info) {
    state.info = info
  },
  clearInfo(state) {
    state.info = {}
  },
}
