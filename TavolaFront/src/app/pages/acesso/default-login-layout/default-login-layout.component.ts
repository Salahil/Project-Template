import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzIconModule } from "ng-zorro-antd/icon"
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: "app-default-login-layout",
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: "./default-login-layout.component.html",
  styleUrl: "./default-login-layout.component.scss",
})
export class DefaultLoginLayoutComponent {
  @Input() title = ""
  @Input() primaryBtnText = ""
  @Input() secondaryBtnText = ""
  @Input() disablePrimaryBtn = false
  @Input() primaryBtnLoading = false
  @Output() submit = new EventEmitter<void>()
  @Output() navigate = new EventEmitter<void>()

  onPrimaryClick() {
    this.submit.emit()
  }

  onSecondaryClick() {
    this.navigate.emit()
  }

  // Register icons on init so child templates can use <i nz-icon nzType="google|linkedin"></i>
  constructor(private iconService: NzIconService) {
    // inline SVG fallbacks (will be used if ant icons package isn't available)
    const GOOGLE_SVG = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M12 11.5v2.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3 2.3C20.5 18.6 21.6 15.8 21.6 12c0-.8-.1-1.5-.2-2.2H12z"/><path fill="#34A853" d="M6 14c-.4-1-.6-2.1-.6-3.2 0-1.1.2-2.2.6-3.2L3 5.3C1.8 7.1 1.2 9.4 1.2 12s.6 4.9 1.8 6.7L6 14z"/><path fill="#4A90E2" d="M12 4.5c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.6 1.2 14.9 0 12 0 8.8 0 6 1.2 4 3.3L7 6.6C8 5.1 9.8 4.5 12 4.5z"/></svg>
    `;

    const LINKEDIN_SVG = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24h5V7H0v17zM8 7h4.8v2.3h.1c.7-1.3 2.4-2.3 4-2.3 4.3 0 5.1 2.8 5.1 6.4V24h-5v-7.7c0-1.8 0-4.1-2.5-4.1-2.5 0-2.8 1.9-2.8 3.9V24H8V7z" fill="currentColor"/></svg>
    `;

    // register literals under predictable names
    try {
      this.iconService.addIconLiteral('google', GOOGLE_SVG);
      this.iconService.addIconLiteral('linkedin', LINKEDIN_SVG);
    } catch (e) {
      // ignore if API differs
    }

    // Try to also load official ant-design icons (non-blocking). If available, add them too.
    import('@ant-design/icons-angular/icons').then(mod => {
      const names = Object.keys(mod).filter(k => /linkedin/i.test(k));
      for (const k of names) {
        const icon = (mod as any)[k];
        try { this.iconService.addIcon(icon); } catch { /* ignore */ }
      }
    }).catch(() => {
      // package not present — literals are already registered
    });
  }

  toggleTheme(dark?: boolean) {
    const root = document.documentElement;
    if (dark === undefined) root.classList.toggle('theme-dark');
    else if (dark) root.classList.add('theme-dark');
    else root.classList.remove('theme-dark');
  }
}