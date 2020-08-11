import newRequest from '@/utils/new-request'

export function fetchContestScores(id) {
  return newRequest({
    url: '/contest/score/' + id,
    method: 'get'
  })
}
