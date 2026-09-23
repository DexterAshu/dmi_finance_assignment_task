export const environment = {
  production: true,
  useMockApi: false,
  apiBaseUrl: 'https://api.dmifinance.com/v1',
  endpoints: {
    leads: '/leads',
    applications: '/applications'
  },
  defaultPageSize: 10,
  statusFilterOptions: ['All', 'Pending', 'Active', 'Rejected', 'Disbursed']
};
