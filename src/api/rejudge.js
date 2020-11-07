import newRequest from '@/utils/new-request'

export function rejudge(type, id) {
  return newRequest({
    url: `/solution/rejudge/${type}/${id}`,
    method: 'patch'
  })
}

// export function rejudgeProblem(id) {
//   return request({
//     url: '/admin/rejudge.php',
//     method: 'post',
//     data: { rjpid: id }
//   })
// }
//
// export function rejudgeSolution(id) {
//   return request({
//     url: '/admin/rejudge.php',
//     method: 'post',
//     data: { rjsid: id }
//   })
// }
//
// export function rejudgeContest(id) {
//   return request({
//     url: '/admin/rejudge.php',
//     method: 'post',
//     data: { rjcid: id }
//   })
// }
//

