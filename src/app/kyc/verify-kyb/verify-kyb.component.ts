import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KycStepperComponent } from '../kyc-stepper/kyc-stepper.component';
import { DocumentUploadComponent, FileMetadata } from '../document-upload/document-upload.component';
import { SecondDocumentModalComponent } from '../second-document-modal/second-document-modal.component';

@Component({
  selector: 'app-verify-kyb',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KycStepperComponent,
    DocumentUploadComponent,
    SecondDocumentModalComponent
  ],
  templateUrl: './verify-kyb.component.html',
  styleUrl: './verify-kyb.component.css'
})
export class VerifyKybComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Document Type Options matching Figma design
  readonly documentTypes: string[] = [
    'GST Certificate',
    'Udyam Registration Certificate (URC)',
    'Shop & Establishment Certificate',
    'Business/ Trade License',
    'FSSAI',
    'Import Export Certificate'
  ];

  // Flow State Signals
  readonly activeStep = signal<number>(1); // 1 = Primary Doc, 2 = Second Doc, 3 = Complete
  readonly showSecondDocPrompt = signal<boolean>(false);
  readonly isFlowCompleted = signal<boolean>(false);

  // File Metadata Signals
  readonly primaryFile = signal<FileMetadata | null>(null);
  readonly secondFile = signal<FileMetadata | null>(null);

  // Primary Document Form
  readonly primaryForm: FormGroup = this.fb.group({
    docType: ['GST Certificate', Validators.required],
    docNumber: ['06AAGCL3497D1Z9', [Validators.required, Validators.minLength(4)]]
  });

  // Second Document Form
  readonly secondForm: FormGroup = this.fb.group({
    docType: ['Udyam Registration Certificate (URC)', Validators.required],
    docNumber: ['UDYAM-YY-02-1234567', [Validators.required, Validators.minLength(4)]]
  });

  // Computed Validation for Continue Buttons
  readonly isPrimaryContinueValid = computed(() => {
    return this.primaryForm.valid && !!this.primaryFile();
  });

  readonly isSecondContinueValid = computed(() => {
    return this.secondForm.valid && !!this.secondFile();
  });

  // Primary File Handlers
  onPrimaryFileSelected(metadata: FileMetadata): void {
    this.primaryFile.set(metadata);
  }

  onPrimaryFileRemoved(): void {
    this.primaryFile.set(null);
  }

  onPrimaryContinue(): void {
    if (!this.isPrimaryContinueValid()) return;
    // Trigger second document prompt modal
    this.showSecondDocPrompt.set(true);
  }

  // Second Document Prompt Handlers
  onUploadSecondChosen(): void {
    this.showSecondDocPrompt.set(false);
    this.activeStep.set(2); // Move to second document form
  }

  onSkipSecondChosen(): void {
    this.showSecondDocPrompt.set(false);
    this.completeKybFlow();
  }

  // Second File Handlers
  onSecondFileSelected(metadata: FileMetadata): void {
    this.secondFile.set(metadata);
  }

  onSecondFileRemoved(): void {
    this.secondFile.set(null);
  }

  onSecondContinue(): void {
    if (!this.isSecondContinueValid()) return;
    this.completeKybFlow();
  }

  completeKybFlow(): void {
    this.activeStep.set(3);
    this.isFlowCompleted.set(true);
  }

  resetFlow(): void {
    this.primaryForm.patchValue({ docType: 'GST Certificate', docNumber: '06AAGCL3497D1Z9' });
    this.secondForm.patchValue({ docType: 'Udyam Registration Certificate (URC)', docNumber: 'UDYAM-YY-02-1234567' });
    this.primaryFile.set(null);
    this.secondFile.set(null);
    this.activeStep.set(1);
    this.showSecondDocPrompt.set(false);
    this.isFlowCompleted.set(false);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applications']);
  }
}
