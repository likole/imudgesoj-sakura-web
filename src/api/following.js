import newRequest from '../utils/new-request'

export function checkFollowingStatus(toUser) {
  return newRequest({
    url: `/following/${toUser}/check`,
    method: 'get'
  })
}

export function followUser(toUser) {
  return newRequest({
    url: `/following/${toUser}`,
    method: 'post'
  })
}

export function unfollowUser(toUser) {
  return newRequest({
    url: `/following/${toUser}`,
    method: 'delete'
  })
}

export function fetchFollowingList() {
  return newRequest({
    url: `/following/following`,
    method: 'get'
  })
}
