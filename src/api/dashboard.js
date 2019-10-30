import request from '@/utils/request'

export function fetchChart() {
  return request({
    url: '/dashboard.php',
    method: 'get'
  })
}

