import newRequest from '@/utils/new-request'

export function getNewsList() {
  return newRequest({
    url: '/news',
    method: 'get'
  })
}

export function getPublishedNewsList() {
  return newRequest({
    url: '/news/published',
    method: 'get'
  })
}

export function getNews(id) {
  return newRequest({
    url: '/news/' + id,
    method: 'get'
  })
}

export function changeNewsStatus(id) {
  return newRequest({
    url: `/news/${id}`,
    method: 'patch'
  })
}

export function addNews(data) {
  return newRequest({
    url: `/news`,
    method: 'post',
    data
  })
}

export function editNews(data) {
  return newRequest({
    url: `/news`,
    method: 'put',
    data
  })
}
