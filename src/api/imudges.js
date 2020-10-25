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

export function getGroupInfo() {
  return newRequest({
    url: `/imudges/recruit/group`,
    method: 'get'
  })
}

export function postGroupInfo(id, data) {
  return newRequest({
    url: `/imudges/recruit/group/${id}`,
    method: 'post',
    data
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

export function updateRecruitOptions(data) {
  return newRequest({
    url: `/imudges/recruit/options`,
    method: 'put',
    data
  })
}

export function getInterviewList(id) {
  return newRequest({
    url: `/imudges/recruit/interview/group/${id}`,
    method: 'get'
  })
}

export function getInterviewDetail(username) {
  return newRequest({
    url: `/imudges/recruit/interview/${username}`,
    method: 'get'
  })
}
