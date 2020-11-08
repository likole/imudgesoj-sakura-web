import newRequest from '@/utils/new-request'

export function rejudge(type, id) {
  return newRequest({
    url: `/solution/rejudge/${type}/${id}`,
    method: 'patch'
  })
}

