import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerComponent } from './spin/global-spinner/global-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalSpinnerComponent],
  template: `<router-outlet />
  <app-global-spinner></app-global-spinner> `
})
export class AppComponent {
  title = 'login-page';
}
