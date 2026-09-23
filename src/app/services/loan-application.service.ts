import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanApplication } from '../models/loan-application.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}${environment.endpoints.applications}`;

  /**
   * Fetches all loan application records from the mock REST API.
   * Filtering and sorting are delegated to client-side components/state.
   */
  getApplications(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(this.apiUrl);
  }
}
