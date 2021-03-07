import request from '@/utils/request'
import newRequest from '@/utils/new-request'

export function fetchList(query) {
  return newRequest({
    url: '/problem',
    method: 'get',
    params: query
  })
}

export function fetchProblem(id) {
  return newRequest({
    url: '/problem/' + id,
    method: 'get'
  })
}

/*
问题状态
 */
export function fetchProblemStatus(id) {
  return request({
    url: '/problemstatus.php',
    method: 'get',
    params: { id }
  })
}

/*
问题状态用户详细AC情况
 */
export function fetchProblemStatusDetail(id, page) {
  return request({
    url: '/problemstatus.php',
    method: 'get',
    params: { id, page }
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

export function fetchStatusOutside(query) {
  return newRequest({
    url: '/solution/status',
    method: 'get',
    params: query
  })
}

export function fetchSource(id) {
  return newRequest({
    url: '/solution/source/' + id,
    method: 'get'
  })
}

export function fetchCE(sid) {
  return newRequest({
    url: '/solution/ce/' + sid,
    method: 'get'
  })
}

export function fetchRE(sid) {
  return newRequest({
    url: '/solution/re/' + sid,
    method: 'get'
  })
}

export function fetchRanklist(query) {
  return newRequest({
    url: '/user/ranklist',
    method: 'get',
    params: query
  })
}

export function fetchCategories() {
  return newRequest({
    url: '/problem/category',
    method: 'get'
  })
}

export function adminGetList(page, pageSize, keywords) {
  return newRequest({
    url: `/problem/admin?page=${page}&pageSize=${pageSize}&keywords=${keywords}`,
    method: 'get'
  })
}

export function adminGetProblem(id) {
  return newRequest({
    url: '/problem/admin/' + id,
    method: 'get'
  })
}

export function adminUpdate(data) {
  return newRequest({
    url: '/problem/admin',
    method: 'put',
    data
  })
}

export function adminAdd(data) {
  return newRequest({
    url: '/problem/admin',
    method: 'post',
    data
  })
}

export function adminChangeStatus(id) {
  return newRequest({
    url: '/problem/admin/' + id,
    method: 'patch'
  })
}
