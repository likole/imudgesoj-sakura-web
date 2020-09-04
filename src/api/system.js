import newRequest from '@/utils/new-request'

export function fetchMemoryInfo() {
  return newRequest({
    url: '/system/memory',
    method: 'get'
  })
}

export function fetchConfigInfo() {
  return newRequest({
    url: '/system/config',
    method: 'get'
  })
}

