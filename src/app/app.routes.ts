import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'applications',
    pathMatch: 'full'
  },
  {
    path: 'applications',
    loadComponent: () =>
      import('./loan-applications/loan-application-list/loan-application-list.component').then(
        (m) => m.LoanApplicationListComponent
      )
  },
  {
    path: 'kyc',
    loadComponent: () =>
      import('./kyc/verify-kyb/verify-kyb.component').then(
        (m) => m.VerifyKybComponent
      )
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      )
  }
];
