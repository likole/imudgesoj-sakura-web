import request from '@/utils/request'

export function getPrivilegeList() {
  return request({
    url: '/admin/privilege.php',
    method: 'get'
  })
}

export function deletePrivilege(uid, rightstr) {
  return request({
    url: `/admin/privilege.php?delete=1&uid=${uid}&rightstr=${rightstr}`,
    method: 'get'
  })
}

export function addPrivilege(data) {
  return request({
    url: `/admin/privilege.php?add_privilege=1`,
    method: 'post',
    data
  })
}
