import newRequest from '@/utils/new-request'

export function fetchDashboardData() {
  return newRequest({
    url: '/dashboard',
    method: 'get'
  })
}

