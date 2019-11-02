import request from '@/utils/request'

export function fetchContests() {
  return request({
    url: '/contest.php',
    method: 'get'
  })
}

export function fetchProblems(cid) {
  return request({
    url: '/contest.php',
    method: 'get',
    params: { cid }
  })
}

export function fetchRanklist(cid) {
  return request({
    url: '/contestrank.php',
    method: 'get',
    params: { cid }
  })
}

// 以下没有用

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

export function fetchSource(id) {
  return request({
    url: '/source.php',
    method: 'get',
    params: { id }
  })
}

export function fetchCE(sid) {
  return request({
    url: '/ce.php',
    method: 'get',
    params: { sid }
  })
}

export function fetchRE(sid) {
  return request({
    url: '/re.php',
    method: 'get',
    params: { sid }
  })
}
