import newRequest from '../utils/new-request'

export function getApplicationInfo(clientId) {
  return newRequest({
    url: `/application/` + clientId,
    method: 'get'
  })
}

export function nonceLogin() {
  return newRequest({
    url: `/auth/nonce/`,
    method: 'post'
  })
}
