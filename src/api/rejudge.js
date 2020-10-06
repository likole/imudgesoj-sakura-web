import request from '@/utils/request'

export function rejudgeProblem(id) {
  return request({
    url: '/admin/rejudge.php',
    method: 'post',
    data: { rjpid: id }
  })
}

export function rejudgeSolution(id) {
  return request({
    url: '/admin/rejudge.php',
    method: 'post',
    data: { rjsid: id }
  })
}

export function rejudgeContest(id) {
  return request({
    url: '/admin/rejudge.php',
    method: 'post',
    data: { rjcid: id }
  })
}

