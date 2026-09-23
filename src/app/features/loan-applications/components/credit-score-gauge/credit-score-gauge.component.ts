import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-score-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-score-gauge.component.html',
  styleUrl: './credit-score-gauge.component.css'
})
export class CreditScoreGaugeComponent {
  readonly score = input.required<number>();

  // Normalized score calculation (300 to 900 range mapped to 0% - 100%)
  readonly normalizedPercentage = computed(() => {
    const raw = this.score();
    const clamped = Math.min(Math.max(raw, 300), 900);
    return Math.round(((clamped - 300) / 600) * 100);
  });

  // Credit Rating Category Label
  readonly ratingCategory = computed(() => {
    const val = this.score();
    if (val < 600) return 'Poor';
    if (val < 700) return 'Fair';
    if (val < 800) return 'Good';
    return 'Excellent';
  });

  // Color code based on credit score range
  readonly ratingColorClass = computed(() => {
    const val = this.score();
    if (val < 600) return 'score-poor';
    if (val < 700) return 'score-fair';
    if (val < 800) return 'score-good';
    return 'score-excellent';
  });
}
