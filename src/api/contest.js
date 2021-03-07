import request from '@/utils/request'
import newRequest from '@/utils/new-request'

export function fetchContests() {
  return newRequest({
    url: '/contest',
    method: 'get'
  })
}

export function fetchProblems(cid, password) {
  return newRequest({
    url: `/contest/${cid}`,
    method: 'get',
    params: { password }
  })
}

export function fetchRanklist(cid) {
  return newRequest({
    url: '/contest/rank/' + cid,
    method: 'get'
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
