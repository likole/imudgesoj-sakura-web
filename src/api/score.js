import request from '@/utils/request'
import newRequest from '@/utils/new-request'

export function fetchList() {
  return request({
    url: '/score_log.php',
    method: 'get'
  })
}

export function fetchAchieveList() {
  return newRequest({
    url: '/task',
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
  return newRequest({
    url: '/task/finish/' + oper,
    method: 'patch'
  })
}

export function scoreRanklist(page) {
  return request({
    url: '/score_ranklist.php',
    method: 'get',
    params: { page }
  })
}
