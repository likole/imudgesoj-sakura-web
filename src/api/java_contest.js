import newRequest from '@/utils/new-request'

export function fetchContestScores(id) {
  return newRequest({
    url: '../java/contest/score/' + id,
    method: 'get'
  })
}
