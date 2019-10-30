import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/score_log.php',
    method: 'get'
  })
}
