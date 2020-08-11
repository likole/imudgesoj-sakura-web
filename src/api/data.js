import newRequest from '../utils/new-request'

export function getDataIds(problemId) {
  return newRequest({
    url: `/data/${problemId}`,
    method: 'get'
  })
}

export function getData(problemId, dataId) {
  return newRequest({
    url: `/data/${problemId}/${dataId}`,
    method: 'get'
  })
}

export function addData(problemId, input,output) {
  return newRequest({
    url: `/data/${problemId}`,
    method: 'post',
    params:{input,output}
  })
}
