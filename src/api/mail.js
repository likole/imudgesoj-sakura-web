import newRequest from '../utils/new-request'

export function postMail(data) {
  return newRequest({
    url: 'mail',
    method: 'post',
    data
  })
}

export function fetchMail(vid) {
  return newRequest({
    url: `mail/${vid}`,
    method: 'get'
  })
}

export function fetchMailList() {
  return newRequest({
    url: 'mail',
    method: 'get'
  })
}

export function fetchUnreadCount() {
  return newRequest({
    url: 'mail/unread',
    method: 'get'
  })
}
