import newRequest from '../utils/new-request'

export function getAvailArticleList(query) {
  return newRequest({
    url: `/article`,
    method: 'get',
    params: query
  })
}

export function getSelfArticleList(page) {
  return newRequest({
    url: `/article/self?page=` + page,
    method: 'get'
  })
}

export function searchProblemIds(keywords) {
  return newRequest({
    url: `/problem/search/ids?keywords=` + keywords,
    method: 'get'
  })
}

export function getArticle(id) {
  return newRequest({
    url: `/article/` + id,
    method: 'get'
  })
}

export function getSummary(content) {
  return newRequest({
    url: `/article/summary`,
    method: 'post',
    data: { content }
  })
}

export function createOrUpdateArticle(data) {
  return newRequest({
    url: `/article/`,
    method: 'put',
    data
  })
}

export function createOrUpdateDraftArticle(data) {
  return newRequest({
    url: `/article/draft`,
    method: 'put',
    data
  })
}

