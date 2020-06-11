import request from '@/utils/request'

/**
 * 使用用户名登录
 * @param username
 * @param password
 */
export function loginByUsername(username, password) {
  return request({
    url: '../java/auth/username',
    method: 'post',
    data: { username, password }
  })
}

/**
 * 使用手机号登录
 * @param phone
 * @param password
 */
export function loginByPhone(phone, password) {
  return request({
    url: '../java/auth/phone',
    method: 'post',
    data: { phone, password }
  })
}

/**
 * 忘记密码 发送短信验证码
 * @param username
 * @param phone
 */
export function sendVerifyCode(username, phone) {
  return request({
    url: '../java/auth/forget',
    method: 'get',
    params: { username, phone }
  })
}

/**
 * 重置密码
 * @param username
 * @param phone
 * @param vcode
 * @param password
 */
export function resetPassword(username, phone, vcode, password) {
  return request({
    url: '../java/auth/forget',
    method: 'post',
    data: { username, phone, vcode, password }
  })
}

/**
 * 更改密码
 * @param data
 */
export function changePassword(data) {
  return request({
    url: '../java/auth/password',
    method: 'patch',
    params: data
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
