import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KycStep {
  id: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

@Component({
  selector: 'app-kyc-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kyc-stepper.component.html',
  styleUrl: './kyc-stepper.component.css'
})
export class KycStepperComponent {
  readonly activeStepId = input<number>(3);

  readonly steps: KycStep[] = [
    { id: 1, label: 'Basic details', status: 'completed' },
    { id: 2, label: 'Loan offers', status: 'completed' },
    { id: 3, label: 'Verify KYC', status: 'active' },
    { id: 4, label: 'Address & e-mandate', status: 'pending' },
    { id: 5, label: 'Sign agreement', status: 'pending' }
  ];
}
