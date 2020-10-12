import newRequest from '../utils/new-request'

export function getSelfRecruit() {
  return newRequest({
    url: `/imudges/recruit/me`,
    method: 'get'
  })
}
