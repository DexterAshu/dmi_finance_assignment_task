import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FileMetadata {
  name: string;
  size: number;
  formattedSize: string;
  type: string;
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent {
  readonly currentFile = input<FileMetadata | null>(null);

  readonly fileSelected = output<FileMetadata>();
  readonly fileRemoved = output<void>();
  readonly errorMessage = output<string | null>();

  readonly validationError = signal<string | null>(null);

  private readonly maxSizeBytes = 2.5 * 1024 * 1024; // 2.5 MB
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', '.jpg', '.jpeg', '.png', '.pdf'];

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.validateAndProcessFile(file);
    // Reset file input value so selecting the same file triggers change event
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.validateAndProcessFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private validateAndProcessFile(file: File): void {
    this.validationError.set(null);
    this.errorMessage.emit(null);

    // 1. File Type Validation
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = this.allowedTypes.includes(file.type.toLowerCase()) || this.allowedTypes.includes(ext);

    if (!isValidType) {
      const err = 'Invalid file type. Please select a JPG, PNG, or PDF file.';
      this.validationError.set(err);
      this.errorMessage.emit(err);
      return;
    }

    // 2. File Size Validation (2.5 MB Limit)
    if (file.size > this.maxSizeBytes) {
      const err = 'File size exceeds maximum limit of 2.5 MB.';
      this.validationError.set(err);
      this.errorMessage.emit(err);
      return;
    }

    // Process valid file metadata
    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      formattedSize: this.formatBytes(file.size),
      type: file.type || ext
    };

    this.fileSelected.emit(metadata);
  }

  onChangeFileClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
