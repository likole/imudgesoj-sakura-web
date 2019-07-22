import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/problems.php',
    method: 'get',
    params: query
  })
}

export function fetchProblem(id) {
  return request({
    url: '/problem.php',
    method: 'get',
    params: { id }
  })
}

export function submitProblem(data) {
  return request({
    url: '/submit.php',
    method: 'post',
    data
  })
}

export function ajaxStatus(data) {
  return request({
    url: '/status-ajax.php',
    method: 'post',
    params: data
  })
}

export function fetchStatus(query) {
  return request({
    url: '/status.php',
    method: 'get',
    params: query
  })
}
