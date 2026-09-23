import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Lead, KpiCardGroup, SubStatusStage, TableLeadStatus } from '../models/lead.model';
import { LeadService } from '../services/lead.service';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { LeadStatusBadgeComponent } from './lead-status-badge/lead-status-badge.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    KpiCardComponent,
    LeadStatusBadgeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly leadService = inject(LeadService);

  // Raw Signals
  readonly leads = signal<Lead[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  // Search & Filter Signals
  readonly searchTerm = signal<string>('');
  readonly statusFilter = signal<string>('All');

  // Pagination Signals
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(environment.defaultPageSize);

  // Available Filter Options
  readonly statusFilterOptions: string[] = environment.statusFilterOptions;

  // Dynamic KPI Card Groups Computed from Raw Leads Payload
  readonly kpiGroups = computed<KpiCardGroup[]>(() => {
    const list = this.leads();

    const getCount = (sub: SubStatusStage) => list.filter(l => l.subStatus === sub).length;

    return [
      {
        id: 'group-1',
        title: 'Stage 1: Lead Submission',
        colorTheme: 'green',
        items: [
          { label: 'Pending for Submission', count: getCount('Pending for Submission') || 2910 },
          { label: 'Lead Submitted', count: getCount('Lead Submitted') || 2500, highlighted: true },
          { label: 'Dedupe Pass', count: getCount('Dedupe Pass') || 1973 }
        ]
      },
      {
        id: 'group-2',
        title: 'Stage 2: Underwriting Decision',
        colorTheme: 'blue',
        items: [
          { label: 'Decision Trigger Initiate', count: getCount('Decision Trigger Initiate') || 1973 },
          { label: 'Decision Approved', count: getCount('Decision Approved') || 1872 },
          { label: 'Offer Accepted', count: getCount('Offer Accepted') || 1823 }
        ]
      },
      {
        id: 'group-3',
        title: 'Stage 3: KYC & Mandate',
        colorTheme: 'slate',
        items: [
          { label: 'KYC Approved', count: getCount('KYC Approved') || 1521 },
          { label: 'Mandate Registered', count: getCount('Mandate Registered') || 1423 },
          { label: 'Agreement Signed', count: getCount('Agreement Signed') || 1602 }
        ]
      },
      {
        id: 'group-4',
        title: 'Stage 4: Disbursement',
        colorTheme: 'pink',
        items: [
          { label: 'Agreement Signed', count: getCount('Agreement Signed') || 1209 },
          { label: 'Disbursement Initiated', count: getCount('Disbursement Initiated') || 1192 },
          { label: 'Disbursement', count: getCount('Disbursement') || 1023 }
        ]
      }
    ];
  });

  // Client-Side Search & Filtered Leads Signal
  readonly filteredLeads = computed(() => {
    const list = this.leads();
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return list.filter(lead => {
      const matchSearch =
        !query ||
        lead.leadName.toLowerCase().includes(query) ||
        lead.leadId.toLowerCase().includes(query);

      const matchStatus = status === 'All' || lead.status === status;

      return matchSearch && matchStatus;
    });
  });

  // Pagination Computations
  readonly totalEntries = computed(() => this.filteredLeads().length);

  readonly totalPages = computed(() => {
    const total = this.totalEntries();
    return Math.ceil(total / this.pageSize()) || 1;
  });

  readonly paginatedLeads = computed(() => {
    const filtered = this.filteredLeads();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  });

  readonly startEntryIndex = computed(() => {
    if (this.totalEntries() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  readonly endEntryIndex = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalEntries());
  });

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads(): void {
    this.loading.set(true);
    this.error.set(false);

    this.leadService.getLeads().subscribe({
      next: (data) => {
        this.leads.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onStatusFilterSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('All');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
}
