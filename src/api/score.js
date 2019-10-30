import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/score_log.php',
    method: 'get'
  })
}

export function fetchAchieveList() {
  return request({
    url: '/score_achieve.php',
    method: 'get'
  })
}

export function achieveOper(oper) {
  return request({
    url: '/score_achieve.php',
    method: 'get',
    params: { oper }
  })
}

