export const API = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  portfolios: {
    list: '/portfolios',
    getById: (id: string) => `/portfolios/${id}`,
    dashboardSummary: (id: string) => `/portfolios/${id}/dashboard/summary`,
  },
};