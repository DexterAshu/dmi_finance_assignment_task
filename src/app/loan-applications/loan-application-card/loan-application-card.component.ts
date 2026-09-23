import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoanApplication } from '../../models/loan-application.model';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { IndianCurrencyPipe } from '../../shared/pipes/indian-currency.pipe';

@Component({
  selector: 'app-loan-application-card',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusBadgeComponent, IndianCurrencyPipe],
  templateUrl: './loan-application-card.component.html',
  styleUrl: './loan-application-card.component.css'
})
export class LoanApplicationCardComponent {
  readonly application = input.required<LoanApplication>();
  readonly cardClick = output<LoanApplication>();

  get initials(): string {
    const name = this.application().applicantName || '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

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
