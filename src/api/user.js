import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    url: '../java/login/username',
    method: 'post',
    data: { username, password }
  })
}

export function loginByPhone(phone, password) {
  return request({
    url: '../java/login/phone',
    method: 'post',
    data: { phone, password }
  })
}

export function sendVerifyCode(username, phone) {
  return request({
    url: '../java/login/forget',
    method: 'get',
    params: { username, phone }
  })
}

export function resetPassword(username, phone, vcode, password) {
  return request({
    url: '../java/login/forget',
    method: 'post',
    data: { username, phone, vcode, password }
  })
}

export function getInfo(token) {
  return request({
    url: '/me.php',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout.php',
    method: 'get'
  })
}

export function fetchProfileBasic(user) {
  return request({
    url: '/profile_basic.php',
    method: 'get',
    params: { user }
  })
}

export function fetchProfileOauth() {
  return request({
    url: '/profile_oauth.php',
    method: 'get'
  })
}
