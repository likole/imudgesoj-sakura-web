import request from '@/utils/request'

export function getNewsList() {
  return request({
    url: '/admin/news.php',
    method: 'get'
  })
}

export function getNews(id) {
  return request({
    url: '/admin/news.php?id=' + id,
    method: 'get'
  })
}

export function changeNewsStatus(id) {
  return request({
    url: `/admin/news.php?changeStatus=1&id=${id}`,
    method: 'get'
  })
}

export function addNews(data) {
  return request({
    url: `/admin/news.php?add=1`,
    method: 'post',
    data
  })
}

export function editNews(data) {
  return request({
    url: `/admin/news.php?edit=1`,
    method: 'post',
    data
  })
}
