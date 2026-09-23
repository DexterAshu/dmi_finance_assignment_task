import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLeadStatus } from '../../models/lead.model';

@Component({
  selector: 'app-lead-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="statusClass">
      <span class="dot"></span>
      {{ status() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    /* Pending: Amber */
    .badge-pending { background-color: #fffbebf5; color: #d97706; border: 1px solid #fde68a; }
    .badge-pending .dot { background-color: #f59e0b; }

    /* Active: Blue */
    .badge-active { background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
    .badge-active .dot { background-color: #3b82f6; }

    /* Rejected: Red */
    .badge-rejected { background-color: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }
    .badge-rejected .dot { background-color: #f43f5e; }

    /* Disbursed: Green */
    .badge-disbursed { background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .badge-disbursed .dot { background-color: #22c55e; }
  `]
})
export class LeadStatusBadgeComponent {
  readonly status = input.required<TableLeadStatus>();

  get statusClass(): string {
    switch (this.status()) {
      case 'Pending': return 'badge-pending';
      case 'Active': return 'badge-active';
      case 'Rejected': return 'badge-rejected';
      case 'Disbursed': return 'badge-disbursed';
      default: return '';
    }
  }
}
