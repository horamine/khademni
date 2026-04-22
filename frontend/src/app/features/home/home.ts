import { Component, inject, OnInit, OnDestroy, signal, HostListener, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly scrolled = signal(false);
  readonly stats = signal([
    { value: 0, target: 1200, label: 'LANDING.STATS_PROJECTS', suffix: '+' },
    { value: 0, target: 850, label: 'LANDING.STATS_FREELANCERS', suffix: '+' },
    { value: 0, target: 420, label: 'LANDING.STATS_CLIENTS', suffix: '+' },
    { value: 0, target: 4.8, label: 'LANDING.STATS_RATING', suffix: '★', isDecimal: true }
  ]);

  readonly features = [
    { icon: 'post_add', titleKey: 'LANDING.FEATURE_POST_TITLE', descKey: 'LANDING.FEATURE_POST_DESC', color: '#FF6B35' },
    { icon: 'send', titleKey: 'LANDING.FEATURE_APPLY_TITLE', descKey: 'LANDING.FEATURE_APPLY_DESC', color: '#004E89' },
    { icon: 'security', titleKey: 'LANDING.FEATURE_SECURE_TITLE', descKey: 'LANDING.FEATURE_SECURE_DESC', color: '#00B894' },
    { icon: 'star_rate', titleKey: 'LANDING.FEATURE_RATING_TITLE', descKey: 'LANDING.FEATURE_RATING_DESC', color: '#FDCB6E' },
    { icon: 'translate', titleKey: 'LANDING.FEATURE_MULTILINGUAL_TITLE', descKey: 'LANDING.FEATURE_MULTILINGUAL_DESC', color: '#F7C59F' },
    { icon: 'phone_android', titleKey: 'LANDING.FEATURE_MOBILE_TITLE', descKey: 'LANDING.FEATURE_MOBILE_DESC', color: '#6c5ce7' },
  ];

  readonly testimonials = [
    { name: 'Karim Benali', role: 'Client — Startup Fintech', text: 'Grâce à Khademni j\'ai trouvé un développeur Angular en 48h. Processus fluide et transparent.', avatar: 'K', rating: 5 },
    { name: 'Salma Ouahabi', role: 'Freelancer — Designer UX', text: 'Mes revenus ont doublé depuis que j\'utilise Khademni. Les projets sont variés et les clients sérieux.', avatar: 'S', rating: 5 },
    { name: 'Youssef El Amrani', role: 'Client — E-commerce', text: 'La qualité des freelancers sur cette plateforme est remarquable. Je reviens à chaque nouveau projet.', avatar: 'Y', rating: 4 },
  ];

  readonly faqItems = signal([
    { qKey: 'LANDING.FAQ_Q1', aKey: 'LANDING.FAQ_A1', open: false },
    { qKey: 'LANDING.FAQ_Q2', aKey: 'LANDING.FAQ_A2', open: false },
    { qKey: 'LANDING.FAQ_Q3', aKey: 'LANDING.FAQ_A3', open: false },
    { qKey: 'LANDING.FAQ_Q4', aKey: 'LANDING.FAQ_A4', open: false },
    { qKey: 'LANDING.FAQ_Q5', aKey: 'LANDING.FAQ_A5', open: false },
    { qKey: 'LANDING.FAQ_Q6', aKey: 'LANDING.FAQ_A6', open: false },
  ]);

  private observer?: IntersectionObserver;
  private statsAnimated = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getDashboardRoute()]);
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleFaq(index: number): void {
    this.faqItems.update(items =>
      items.map((item, i) => ({ ...item, open: i === index ? !item.open : false }))
    );
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.id === 'stats-strip' && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounters();
          }
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer!.observe(el);
    });
  }

  private animateCounters(): void {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    this.stats().forEach((stat, i) => {
      let current = 0;
      const step = stat.target / steps;
      const timer = setInterval(() => {
        current = Math.min(current + step, stat.target);
        this.stats.update(stats => stats.map((s, j) =>
          j === i ? { ...s, value: stat.isDecimal ? Math.round(current * 10) / 10 : Math.floor(current) } : s
        ));
        if (current >= stat.target) clearInterval(timer);
      }, interval);
    });
  }
}

