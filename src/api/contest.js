import request from '@/utils/request'
import newRequest from '@/utils/new-request'

export function fetchContests() {
  return request({
    url: '/contest.php',
    method: 'get'
  })
}

export function fetchProblems(cid, data) {
  return request({
    url: '/contest.php',
    method: 'post',
    params: { cid },
    data
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
export function adminGetList(page, keyword) {
  return newRequest({
    url: '/contest/admin',
    method: 'get',
    params: { page, keyword }
  })
}

export function adminGetContest(cid) {
  return newRequest({
    url: '/contest/admin/' + cid,
    method: 'get'
  })
}

export function adminChangeStatus(cid) {
  return newRequest({
    url: '/contest/admin/status/' + cid,
    method: 'patch'
  })
}

export function adminChangePrivate(cid) {
  return newRequest({
    url: '/contest/admin/private/' + cid,
    method: 'patch'
  })
}

export function adminUpdateContest(data) {
  return newRequest({
    url: '/contest/admin',
    method: 'put',
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
