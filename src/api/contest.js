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

export function fetchProblem(cid, pid) {
  return request({
    url: '/problem.php',
    method: 'get',
    params: { cid, pid }
  })
}

// admin
export function adminGetList(page) {
  return request({
    url: '/admin/contest.php',
    method: 'get',
    params: { page }
  })
}

export function adminGetContest(cid) {
  return request({
    url: '/admin/contest.php',
    method: 'get',
    params: { cid }
  })
}

export function adminChangeStatus(cid) {
  return request({
    url: '/admin/contest.php?changeStatus=1&cid=' + cid,
    method: 'get'
  })
}

export function adminChangePrivate(cid) {
  return request({
    url: '/admin/contest.php?changePrivate=1&cid=' + cid,
    method: 'get'
  })
}

export function adminAddContest(data) {
  return request({
    url: '/admin/contest.php?add=1',
    method: 'post',
    data
  })
}

export function adminUpdateContest(data) {
  return request({
    url: '/admin/contest.php?update=1',
    method: 'post',
    data
  })
}

// 以下没有用

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
