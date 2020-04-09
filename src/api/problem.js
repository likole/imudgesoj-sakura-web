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

export function adminGetList(page) {
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


export function adminChangeStatus(id) {
  return request({
    url: '/admin/problem.php?changeStatus=1&id=' + id,
    method: 'get'
  })
}
