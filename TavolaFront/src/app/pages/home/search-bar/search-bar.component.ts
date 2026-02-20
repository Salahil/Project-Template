import { Component, EventEmitter, Input, Output, HostListener, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, of, Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatTooltipModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  animations: [
    trigger('searchBarAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-24px)' }),
        animate('250ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'none' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'translateY(-24px)' }))
      ])
    ])
  ],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() citySuggestions: string[] = [];
  @Input() querySuggestions: string[] = [];
  @Input() showCityDropdown = false;
  @Input() showQueryDropdown = false;
  @Input() cityCtrl: FormControl = new FormControl('');
  @Input() queryCtrl: FormControl = new FormControl('');
  @Input() filteredCities$: Observable<string[]> = of([]);
  @Input() filteredQueries$: Observable<string[]> = of([]);
  @Output() search = new EventEmitter<void>();
  @Output() cityInput = new EventEmitter<any>();
  @Output() queryInput = new EventEmitter<any>();
  @Output() selectCity = new EventEmitter<string>();
  @Output() selectQuery = new EventEmitter<string>();
  @Output() cityBlur = new EventEmitter<FocusEvent>();
  @Output() filtrosClick = new EventEmitter<void>();

  isMobile = false;
  private destroy$ = new Subject<void>();
  private breakpointObserver = inject(BreakpointObserver);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Detecta se é mobile
    if (this.breakpointObserver) {
      this.breakpointObserver.observe([Breakpoints.Handset])
        .pipe(
          map(result => result.matches),
          takeUntil(this.destroy$)
        )
        .subscribe(isMobile => {
          this.isMobile = isMobile;
          this.cdr.markForCheck();
        });
    } else {
      // Fallback para verificar tamanho da tela
      this.isMobile = window.innerWidth <= 768;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCidadeInput(event: any) { this.cityInput.emit(event); }
  onQueryInput(event: any) { this.queryInput.emit(event); }
  onSelectCity(city: string) { this.selectCity.emit(city); }
  onSelectQuery(query: string) { this.selectQuery.emit(query); }
  onSearch() { this.search.emit(); }
  onCityBlur(event: FocusEvent) { this.cityBlur.emit(event); }
  onFiltrosClick() { this.filtrosClick.emit(); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-group')) {
      this.showCityDropdown = false;
      this.showQueryDropdown = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    this.cdr.markForCheck();
  }
} 