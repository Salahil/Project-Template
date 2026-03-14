import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Centraliza o popup do Google (accounts.google.com) no meio da tela
if (typeof window !== 'undefined') {
  const originalOpen = window.open;
  window.open = function (
    url?: string | URL,
    target?: string,
    features?: string
  ): Window | null {
    if (url?.toString().includes('accounts.google.com')) {
      const w = 500;
      const h = 600;
      const left = Math.max(0, (window.screen?.width ?? 800) / 2 - w / 2);
      const top = Math.max(0, (window.screen?.height ?? 600) / 2 - h / 2);
      const center = `left=${left},top=${top},width=${w},height=${h}`;
      // Remove left/top/width/height antigos para não conflitar
      if (features) {
        features = features
          .replace(/\b(left|top|width|height)=\d+/gi, '')
          .replace(/,+/g, ',')
          .replace(/^,|,$/g, '') || '';
        features = features ? `${features},${center}` : center;
      } else {
        features = center;
      }
    }
    return originalOpen.call(window, url, target, features);
  };
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

