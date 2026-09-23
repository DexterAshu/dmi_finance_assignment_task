export const environment = {
  production: false,
  useMockApi: true,
  apiBaseUrl: 'http://localhost:3000',
  endpoints: {
    leads: '/leads',
    applications: '/applications'
  },
  defaultPageSize: 10,
  statusFilterOptions: ['All', 'Pending', 'Active', 'Rejected', 'Disbursed']
};
