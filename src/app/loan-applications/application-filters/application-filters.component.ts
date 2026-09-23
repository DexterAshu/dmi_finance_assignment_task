import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanStatus, LoanType } from '../../models/loan-application.model';

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

@Component({
  selector: 'app-application-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-filters.component.html',
  styleUrl: './application-filters.component.css'
})
export class ApplicationFiltersComponent {
  // Input Signal bindings for active values
  readonly selectedStatus = input.required<LoanStatus | 'All'>();
  readonly selectedLoanType = input.required<LoanType | 'All'>();
  readonly selectedSort = input.required<SortOption>();

  // Output event emitters for user selection changes
  readonly statusChange = output<LoanStatus | 'All'>();
  readonly loanTypeChange = output<LoanType | 'All'>();
  readonly sortChange = output<SortOption>();
  readonly clearFilters = output<void>();

  readonly statusOptions: (LoanStatus | 'All')[] = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'];
  readonly loanTypeOptions: (LoanType | 'All')[] = ['All', 'Personal', 'Business', 'Home'];

  onStatusSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LoanStatus | 'All';
    this.statusChange.emit(value);
  }

  onLoanTypeSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LoanType | 'All';
    this.loanTypeChange.emit(value);
  }

  onSortSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortChange.emit(value);
  }

  onReset(): void {
    this.clearFilters.emit();
  }
}
