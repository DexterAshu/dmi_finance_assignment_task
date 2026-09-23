import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardGroup } from '../../models/lead.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css'
})
export class KpiCardComponent {
  readonly cardGroup = input.required<KpiCardGroup>();
}
