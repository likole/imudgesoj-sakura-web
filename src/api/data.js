import request from '@/utils/request'

export function getDataIds(problemId) {
  return request({
    url: `../java/data/${problemId}`,
    method: 'get'
  })
}

export function getData(problemId, dataId) {
  return request({
    url: `../java/data/${problemId}/${dataId}`,
    method: 'get'
  })
}
