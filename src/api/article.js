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

export function getArticle(id) {
  return newRequest({
    url: `/article/` + id,
    method: 'get'
  })
}
