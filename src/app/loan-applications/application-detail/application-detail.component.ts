import { Component, input, output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LoanApplication, LoanStatus } from '../../models/loan-application.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { CreditScoreGaugeComponent } from '../credit-score-gauge/credit-score-gauge.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    StatusBadgeComponent,
    CreditScoreGaugeComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent {
  readonly application = input.required<LoanApplication>();

  readonly closeDrawer = output<void>();
  readonly statusUpdated = output<{ id: string; newStatus: LoanStatus }>();

  // Temporary selected status awaiting confirmation
  readonly pendingStatus = signal<LoanStatus | null>(null);
  readonly showConfirmationModal = signal<boolean>(false);

  readonly statusOptions: LoanStatus[] = ['Pending', 'Under Review', 'Approved', 'Rejected'];

  onStatusSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LoanStatus;
    if (value === this.application().status) {
      this.pendingStatus.set(null);
      this.showConfirmationModal.set(false);
      return;
    }
    this.pendingStatus.set(value);
    this.showConfirmationModal.set(true);
  }

  confirmStatusChange(): void {
    const targetStatus = this.pendingStatus();
    if (targetStatus && targetStatus !== this.application().status) {
      this.statusUpdated.emit({
        id: this.application().id,
        newStatus: targetStatus
      });
    }
    this.pendingStatus.set(null);
    this.showConfirmationModal.set(false);
  }

  cancelStatusChange(): void {
    this.pendingStatus.set(null);
    this.showConfirmationModal.set(false);
  }

  onClose(): void {
    this.closeDrawer.emit();
  }
}
