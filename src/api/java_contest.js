import request from '@/utils/request'

export function fetchContestScores(id) {
  return request({
    url: '../java/contest/score/' + id,
    method: 'get'
  })
}
