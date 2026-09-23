import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanStatus } from '../../models/loan-application.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="statusClass">
      <span class="status-dot"></span>
      {{ status() }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      text-transform: capitalize;
      letter-spacing: 0.02em;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }

    /* Pending: Amber/Yellow */
    .status-pending {
      background-color: #fffbebf5;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .status-pending .status-dot {
      background-color: #f59e0b;
    }

    /* Under Review: Blue/Indigo */
    .status-under-review {
      background-color: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }
    .status-under-review .status-dot {
      background-color: #3b82f6;
    }

    /* Approved: Emerald/Green */
    .status-approved {
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }
    .status-approved .status-dot {
      background-color: #10b981;
    }

    /* Rejected: Rose/Red */
    .status-rejected {
      background-color: #fff1f2;
      color: #be123c;
      border: 1px solid #fecdd3;
    }
    .status-rejected .status-dot {
      background-color: #f43f5e;
    }
  `]
})
export class StatusBadgeComponent {
  readonly status = input.required<LoanStatus>();

  get statusClass(): string {
    switch (this.status()) {
      case 'Pending':
        return 'status-pending';
      case 'Under Review':
        return 'status-under-review';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }
}
