import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login.php',
    method: 'post',
    data
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
