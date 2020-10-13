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

export function getRecruitList(params) {
  return newRequest({
    url: `/imudges/recruit`,
    method: 'get',
    params
  })
}

export function updateRecruitStatus(username, id1, id2) {
  return newRequest({
    url: `/imudges/recruit/${username}/${id1}/${id2}`,
    method: 'patch'
  })
}

export function getRecruitOptions() {
  return newRequest({
    url: `/imudges/recruit/options`,
    method: 'get'
  })
}
