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

export function fetchVip() {
  return request({
    url: '/score_vip.php',
    method: 'get'
  })
}

export function openVip(open) {
  return request({
    url: '/score_vip.php',
    method: 'get',
    params: { open }
  })
}

export function achieveOper(oper) {
  return request({
    url: '/score_achieve.php',
    method: 'get',
    params: { oper }
  })
}

export function scoreRanklist(page) {
  return request({
    url: '/score_ranklist.php',
    method: 'get',
    params: { page }
  })
}
