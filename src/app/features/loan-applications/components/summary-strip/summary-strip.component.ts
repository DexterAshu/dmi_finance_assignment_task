import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndianCurrencyPipe } from '../../../../shared/pipes/indian-currency.pipe';

@Component({
  selector: 'app-summary-strip',
  standalone: true,
  imports: [CommonModule, IndianCurrencyPipe],
  templateUrl: './summary-strip.component.html',
  styleUrl: './summary-strip.component.css'
})
export class SummaryStripComponent {
  readonly totalApplications = input.required<number>();
  readonly pipelineAmount = input.required<number>();
  readonly approvalRate = input.required<number>();
}
