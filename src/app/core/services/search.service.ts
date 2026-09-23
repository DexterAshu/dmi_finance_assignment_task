import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  readonly searchTerm = signal<string>('');

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  clearSearchTerm(): void {
    this.searchTerm.set('');
  }
}
