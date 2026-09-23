import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-summary-strip',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './summary-strip.component.html',
  styleUrl: './summary-strip.component.css'
})
export class SummaryStripComponent {
  readonly totalApplications = input.required<number>();
  readonly pipelineAmount = input.required<number>();
  readonly approvalRate = input.required<number>();
}
