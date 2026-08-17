import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);
  themeColor = signal<string>('pink');

  isBrowser: boolean;

  colors: Record<string, Record<string, string>> = {
    pink: {
      '--color-primary-50': '#fdf2f8',
      '--color-primary-100': '#fce7f3',
      '--color-primary-200': '#fbcfe8',
      '--color-primary-300': '#f9a8d4',
      '--color-primary-400': '#f472b6',
      '--color-primary-500': '#ec4899',
      '--color-primary-600': '#db2777',
      '--color-primary-700': '#be185d',
      '--color-primary-800': '#9d174d',
      '--color-primary-900': '#831843',
    },
    violet: {
      '--color-primary-50': '#f5f3ff',
      '--color-primary-100': '#ede9fe',
      '--color-primary-200': '#ddd6fe',
      '--color-primary-300': '#c4b5fd',
      '--color-primary-400': '#a78bfa',
      '--color-primary-500': '#8b5cf6',
      '--color-primary-600': '#7c3aed',
      '--color-primary-700': '#6d28d9',
      '--color-primary-800': '#5b21b6',
      '--color-primary-900': '#4c1d95',
    },
    teal: {
      '--color-primary-50': '#f0fdfa',
      '--color-primary-100': '#ccfbf1',
      '--color-primary-200': '#99f6e4',
      '--color-primary-300': '#5eead4',
      '--color-primary-400': '#2dd4bf',
      '--color-primary-500': '#14b8a6',
      '--color-primary-600': '#0d9488',
      '--color-primary-700': '#0f766e',
      '--color-primary-800': '#115e59',
      '--color-primary-900': '#134e4a',
    }
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const savedMode = localStorage.getItem('isDarkMode');
      const savedColor = localStorage.getItem('themeColor');

      if (savedMode !== null) {
        this.isDarkMode.set(savedMode === 'true');
      }
      if (savedColor !== null && this.colors[savedColor]) {
        this.themeColor.set(savedColor);
      }

      this.applyTheme();
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
  }

  setThemeColor(color: string) {
    if (this.colors[color]) {
      this.themeColor.set(color);
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (!this.isBrowser) return;

    localStorage.setItem('isDarkMode', String(this.isDarkMode()));
    localStorage.setItem('themeColor', this.themeColor());

    const root = document.documentElement;
    const body = document.body;

    if (this.isDarkMode()) {
      root.classList.add('dark');
      body.classList.add('dark-theme'); // for Angular Material
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark-theme');
    }

    const currentColors = this.colors[this.themeColor()];
    for (const [key, value] of Object.entries(currentColors)) {
      root.style.setProperty(key, value);
    }
  }
}
