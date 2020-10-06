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

export function fetchBag() {
  return newRequest({
    url: '/bag',
    method: 'get'
  })
}

export function achieveGoods(id) {
  return newRequest({
    url: '/bag/' + id,
    method: 'post'
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

/**
 * 获取积分排名
 * @param page
 * @returns {AxiosPromise}
 */
export function scoreRanklist(page) {
  return newRequest({
    url: '/points/rank',
    method: 'get',
    params: { page: page, pageSize: 50 }
  })
}
