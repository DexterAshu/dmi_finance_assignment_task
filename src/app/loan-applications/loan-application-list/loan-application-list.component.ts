import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanApplication, LoanStatus, LoanType } from '../../models/loan-application.model';
import { LoanApplicationService } from '../../services/loan-application.service';
import { SummaryStripComponent } from '../summary-strip/summary-strip.component';
import { LoanApplicationCardComponent } from '../loan-application-card/loan-application-card.component';
import { ApplicationFiltersComponent, SortOption } from '../application-filters/application-filters.component';
import { ApplicationDetailComponent } from '../application-detail/application-detail.component';

@Component({
  selector: 'app-loan-application-list',
  standalone: true,
  imports: [
    CommonModule,
    SummaryStripComponent,
    LoanApplicationCardComponent,
    ApplicationFiltersComponent,
    ApplicationDetailComponent
  ],
  templateUrl: './loan-application-list.component.html',
  styleUrl: './loan-application-list.component.css'
})
export class LoanApplicationListComponent implements OnInit {
  private readonly loanService = inject(LoanApplicationService);

  // Raw State Signals
  readonly applications = signal<LoanApplication[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  // Selected Application for Detail Side Drawer
  readonly selectedApplication = signal<LoanApplication | null>(null);

  // Filter & Sort State Signals
  readonly statusFilter = signal<LoanStatus | 'All'>('All');
  readonly loanTypeFilter = signal<LoanType | 'All'>('All');
  readonly sortOption = signal<SortOption>('date-desc');

  // Summary Metrics Computed Signals (Derived from complete dataset)
  readonly totalApplications = computed(() => this.applications().length);

  readonly pipelineAmount = computed(() => {
    return this.applications()
      .filter(app => app.status === 'Pending' || app.status === 'Under Review')
      .reduce((sum, app) => sum + app.amount, 0);
  });

  readonly approvalRate = computed(() => {
    const total = this.totalApplications();
    if (total === 0) return 0;
    const approved = this.applications().filter(app => app.status === 'Approved').length;
    return Math.round((approved / total) * 100);
  });

  // Client-Side Filtered & Sorted Applications Signal
  readonly filteredApplications = computed(() => {
    const list = this.applications();
    const status = this.statusFilter();
    const type = this.loanTypeFilter();
    const sort = this.sortOption();

    // 1. Client-Side Multi-Criteria Filtering
    const filtered = list.filter(app => {
      const matchStatus = status === 'All' || app.status === status;
      const matchType = type === 'All' || app.loanType === type;
      return matchStatus && matchType;
    });

    // 2. Client-Side Immutably-Sorted Output
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'date-asc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  });

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.loading.set(true);
    this.error.set(false);

    this.loanService.getApplications().subscribe({
      next: (data) => {
        this.applications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onSelectApplication(app: LoanApplication): void {
    this.selectedApplication.set(app);
  }

  onCloseDetailDrawer(): void {
    this.selectedApplication.set(null);
  }

  onStatusUpdated(event: { id: string; newStatus: LoanStatus }): void {
    // 1. Immutable local state update in applications signal
    this.applications.update(list =>
      list.map(item =>
        item.id === event.id ? { ...item, status: event.newStatus } : item
      )
    );

    // 2. Synchronize selected application state
    const current = this.selectedApplication();
    if (current && current.id === event.id) {
      this.selectedApplication.set({ ...current, status: event.newStatus });
    }
  }

  onStatusFilterChange(status: LoanStatus | 'All'): void {
    this.statusFilter.set(status);
  }

  onLoanTypeFilterChange(type: LoanType | 'All'): void {
    this.loanTypeFilter.set(type);
  }

  onSortOptionChange(sort: SortOption): void {
    this.sortOption.set(sort);
  }

  clearAllFilters(): void {
    this.statusFilter.set('All');
    this.loanTypeFilter.set('All');
    this.sortOption.set('date-desc');
  }
}
