import { Injectable, signal, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Theme = 'light' | 'dark';
export type Lang = 'fr' | 'ar';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly translate = inject(TranslateService);

  readonly theme = signal<Theme>(this.loadTheme());
  readonly lang = signal<Lang>(this.loadLang());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    });

    effect(() => {
      const l = this.lang();
      localStorage.setItem('lang', l);
      this.translate.use(l);
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    });

    // initialise translate
    this.translate.setDefaultLang('fr');
    this.translate.use(this.lang());
  }

  toggleTheme(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  toggleLang(): void {
    this.lang.update(l => (l === 'fr' ? 'ar' : 'fr'));
  }

  setLang(l: Lang): void {
    this.lang.set(l);
  }

  setTheme(t: Theme): void {
    this.theme.set(t);
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private loadLang(): Lang {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'fr' || stored === 'ar') return stored;
    return 'fr';
  }
}
