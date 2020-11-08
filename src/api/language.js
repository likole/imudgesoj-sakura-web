import newRequest from '../utils/new-request'

export function getAllLanguages() {
  return newRequest({
    url: `/language/all`,
    method: 'get'
  })
}
