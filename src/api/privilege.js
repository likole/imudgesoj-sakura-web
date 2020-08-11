import newRequest from '@/utils/new-request'

export function getPrivilegeList() {
  return newRequest({
    url: '/privilege',
    method: 'get'
  })
}

export function deletePrivilege(uid, rightstr) {
  return newRequest({
    url: `/privilege`,
    method: 'delete',
    data: { userId: uid, rightstr: rightstr }
  })
}

export function addPrivilege(data) {
  return newRequest({
    url: `/privilege`,
    method: 'post',
    data
  })
}
