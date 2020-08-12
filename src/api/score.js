import request from '@/utils/request'
import newRequest from '@/utils/new-request'

/**
 * 获取积分记录
 * @param page
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function fetchList(page, pageSize) {
  return newRequest({
    url: '/points',
    method: 'get',
    params: { page: page, pageSize: pageSize }
  })
}

/**
 * 获取目前积分
 * @returns {AxiosPromise}
 */
export function getTotalScore() {
  return newRequest({
    url: '/points/total',
    method: 'get'
  })
}

/**
 * 获取任务列表
 * @returns {AxiosPromise}
 */
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

/**
 * 领取任务奖励
 * @param oper
 * @returns {AxiosPromise}
 */
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
