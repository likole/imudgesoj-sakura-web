import newRequest from '../utils/new-request'

export function getSelfRecruit() {
  return newRequest({
    url: `/imudges/recruit/me`,
    method: 'get'
  })
}

export function postRecruitEnroll(data) {
  return newRequest({
    url: `/imudges/recruit/enroll`,
    method: 'post',
    data
  })
}
