import newRequest from '../utils/new-request'

export function getAvailArticleList(page) {
  return newRequest({
    url: `/article?page=` + page,
    method: 'get'
  })
}

export function getArticle(id) {
  return newRequest({
    url: `/article/` + id,
    method: 'get'
  })
}
