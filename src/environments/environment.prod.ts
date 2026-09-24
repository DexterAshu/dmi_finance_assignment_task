export const environment = {
  production: true,
  useMockApi: false,
  apiBaseUrl: 'https://dmi-finance-assignment-task.onrender.com',
  endpoints: {
    leads: '/leads',
    applications: '/applications'
  },
  defaultPageSize: 10,
  statusFilterOptions: ['All', 'Pending', 'Active', 'Rejected', 'Disbursed']
};
