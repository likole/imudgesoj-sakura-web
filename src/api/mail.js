import request from '@/utils/request'

export function postEmail(data) {
  return request({
    url: '/mail.php',
    method: 'post',
    data
  })
}

export function fetchEmail(vid) {
  return request({
    url: '/mail.php?vid=' + vid,
    method: 'get'
  })
}

export function fetchEmailList() {
  return request({
    url: '/mail.php',
    method: 'get'
  })
}
