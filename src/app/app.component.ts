import { Component, OnInit, signal, inject, ElementRef, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchService } from './core/services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  private readonly searchService = inject(SearchService);
  private readonly elementRef = inject(ElementRef);

  readonly isNavMenuOpen = signal<boolean>(false);
  readonly showNavHint = signal<boolean>(false);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const hasClicked = localStorage.getItem('dmi_has_clicked_nav_menu');
      if (!hasClicked) {
        this.showNavHint.set(true);
      }
    }
  }

  toggleNavMenu(event: MouseEvent): void {
    event.stopPropagation();
    const nextState = !this.isNavMenuOpen();
    this.isNavMenuOpen.set(nextState);

    // Permanently hide indicator once visitor clicks the 3 dots button
    if (this.showNavHint()) {
      this.dismissNavHint();
    }
  }

  dismissNavHint(): void {
    this.showNavHint.set(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('dmi_has_clicked_nav_menu', 'true');
    }
  }

  closeNavMenu(): void {
    this.isNavMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isNavMenuOpen()) {
      const dropdownElement = this.elementRef.nativeElement.querySelector('.nav-dropdown-wrapper');
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        this.closeNavMenu();
      }
    }
  }

  onGlobalSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value);
  }
}
