import Cookie from 'js-cookie'
Cookie.defaults = {
  // domain: 'localhost:8090/',
  // sameSite: 'None',
  sameSite: 'Lax',
  Secure: false,
  expires: 7,
}

export default {
  initAuth(vuexContext, req) {
    let token

    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const tokenCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('token='))
      if (!tokenCookie) {
        return
      }
      token = tokenCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
    }

    if (!token) {
      return vuexContext.dispatch('logout')
    }

    const parsedJWT = parseJwt(token)
    const role = parsedJWT.role
    const expireToken = parsedJWT.expireToken

    if (new Date().getTime() > +expireToken) {
      return vuexContext.dispatch('logout')
    }

    vuexContext.commit('setToken', token)
    vuexContext.commit('setRole', role)
    vuexContext.commit('setExpireToken', expireToken)
  },
  requestOTP(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .requestOTP(data)
        .then((result) => {
          resolve(result.tempToken)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  confirmOTP(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .confirmOTP(data)
        .then((result) => {
          const token = result['X-Access-Token']
          const parsedJWT = parseJwt(token)
          const role = parsedJWT.role
          const expireDate = parsedJWT.expireToken
          const expireToken = Number.parseInt(new Date(expireDate).getTime())
          vuexContext.commit('setToken', token)
          vuexContext.commit('setRole', role)
          vuexContext.commit('setExpireToken', expireToken)
          localStorage.setItem('token', token)
          Cookie.set('token', token)
          resolve()
        })
        .catch((status) => {
          reject(status)
        })
    })
  },
  logout(vuexContext) {
    this.$api
      .logout()
      .then(() => {})
      .catch(() => {})
    vuexContext.commit('clearToken')
    vuexContext.commit('clearInfo')
    Cookie.remove('token')
    if (process.client) localStorage.removeItem('token')
  },
  getInfo(vuexContext) {
    return new Promise((resolve, reject) => {
      // const info = vuexContext.rootState.auth.info
      // if (info) return resolve(info)
      this.$api
        .getInfo()
        .then((result) => {
          const info = result
          vuexContext.commit('setInfo', info)
          resolve(result)
        })
        .catch((status) => {
          reject(status)
        })
    })
  },
  editInfo(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .editInfo(data)
        .then((result) => {
          const info = result
          vuexContext.commit('setInfo', info)
          resolve(result)
        })
        .catch((status) => {
          reject(status)
        })
    })
  },
}

function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const base64Decode = process.client
    ? atob(base64)
    : Buffer.from(base64, 'base64')

  const jsonPayload = decodeURIComponent(
    String(base64Decode)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
