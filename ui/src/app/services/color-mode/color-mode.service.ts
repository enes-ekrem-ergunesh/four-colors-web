import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {
  private themeSubject = new BehaviorSubject<'dark' | 'light'>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.detectTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.detectTheme.bind(this));
  }

  private detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.themeSubject.next(prefersDark ? 'dark' : 'light');
  }
}
