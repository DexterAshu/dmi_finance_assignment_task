import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LoanApplication } from '../../models/loan-application.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-loan-application-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, StatusBadgeComponent],
  templateUrl: './loan-application-card.component.html',
  styleUrl: './loan-application-card.component.css'
})
export class LoanApplicationCardComponent {
  readonly application = input.required<LoanApplication>();
  readonly cardClick = output<LoanApplication>();

  onCardSelect(): void {
    this.cardClick.emit(this.application());
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardSelect();
    }
  }
}
