import request from '@/utils/request'
import newRequest from '@/utils/new-request'

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

export function fetchSource(id) {
  return request({
    url: '/source.php',
    method: 'get',
    params: { id }
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
  return request({
    url: '/ranklist.php',
    method: 'get',
    params: query
  })
}

export function fetchCategories() {
  return request({
    url: '/category.php',
    method: 'get'
  })
}

export function adminGetList(page, keywords) {
  if (keywords !== undefined && keywords.length > 0) {
    return request({
      url: '/admin/problem.php?keyword=' + keywords,
      method: 'get'
    })
  }
  if (page === undefined) {
    return request({
      url: '/admin/problem.php',
      method: 'get'
    })
  }
  return request({
    url: '/admin/problem.php?page=' + page,
    method: 'get'
  })
}

export function adminGetProblem(id) {
  return request({
    url: '/admin/problem.php?id=' + id,
    method: 'get'
  })
}

export function adminUpdate(data) {
  return request({
    url: '/admin/problem.php?update=1',
    method: 'post',
    data
  })
}

export function adminAdd(data) {
  return request({
    url: '/admin/problem.php?add=1',
    method: 'post',
    data
  })
}

export function adminChangeStatus(id) {
  return request({
    url: '/admin/problem.php?changeStatus=1&id=' + id,
    method: 'get'
  })
}
