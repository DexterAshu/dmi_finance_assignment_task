import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-second-document-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './second-document-modal.component.html',
  styleUrl: './second-document-modal.component.css'
})
export class SecondDocumentModalComponent {
  readonly uploadSecond = output<void>();
  readonly skipAndProceed = output<void>();

  onUploadSecond(): void {
    this.uploadSecond.emit();
  }

  onSkip(): void {
    this.skipAndProceed.emit();
  }
}
