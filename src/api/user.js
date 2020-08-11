import request from '@/utils/request'
import newRequest from '../utils/new-request'

/**
 * 使用用户名登录
 * @param username
 * @param password
 */
export function loginByUsername(username, password) {
  return newRequest({
    url: '/auth/username',
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
  return newRequest({
    url: '/auth/phone',
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
  return newRequest({
    url: '/auth/forget',
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
  return newRequest({
    url: '/auth/forget',
    method: 'post',
    data: { username, phone, vcode, password }
  })
}

/**
 * 更改密码
 * @param data
 */
export function changePassword(data) {
  return newRequest({
    url: '/auth/password',
    method: 'patch',
    params: data
  })
}

/**
 * 管理员使用的更改密码
 * @param data
 * @returns {AxiosPromise}
 */
export function forceChangePassword(data) {
  return newRequest({
    url: '/auth/forcePassword',
    method: 'patch',
    params: data
  })
}

export function getInfo(token) {
  return newRequest({
    url: '/auth/me',
    method: 'get'
  })
}

// export function logout() {
//   return request({
//     url: '/logout.php',
//     method: 'get'
//   })
// }

/**
 * 获取个人基本信息（User以及刷题信息）
 * @param user
 */
export function fetchProfileBasic(user) {
  return request({
    url: '/profile_basic.php',
    method: 'get',
    params: { user }
  })
}

/**
 * @deprecated
 * 从开放平台获取数据，已废弃
 */
export function fetchProfileOauth() {
  return request({
    url: '/profile_oauth.php',
    method: 'get'
  })
}

/**
 * 获取用户个人信息（UserInfo）
 */
export function fetchUserInfo() {
  return newRequest({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 更新用户个人基本信息（UserInfo->Basic)
 */
export function updateBasicInfo(data) {
  return newRequest({
    url: '/user/info/basic',
    method: 'put',
    data
  })
}

/**
 * 更新用户个人联系信息（UserInfo->Contact)
 */
export function updateContactInfo(data) {
  return newRequest({
    url: '/user/info/contact',
    method: 'put',
    data
  })
}

/**
 * 获取用户列表，包含LoginUser以及UserInfo
 * 用于用户管理界面
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserList(data) {
  return newRequest({
    url: '/user/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取用户列表，包含LoginUser以及UserInfo
 * 用于用户管理界面
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function registerUser(data) {
  return newRequest({
    url: '/auth/register',
    method: 'post',
    params: data
  })
}
