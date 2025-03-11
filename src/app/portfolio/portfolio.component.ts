import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private scrollObserver!: IntersectionObserver;
  private routerSubscription!: Subscription;
  
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    // Scroll to top when navigating to this page
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
    
    // Ensure no gap with footer
    this.removeFooterGap();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initScrollAnimation();
      this.removeFooterGap();
      this.randomizeMeteors(); // Add randomization for meteors
    }, 100);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and observers
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    
    // Reset footer styling when leaving this page
    this.resetFooterGap();
  }
  
  removeFooterGap() {
    // Find the app-footer element
    const appFooter = document.querySelector('app-footer');
    
    // Find the footer element inside app-footer
    const innerFooter = document.querySelector('app-footer > footer');
    
    if (appFooter) {
      // Force a negative margin to connect with our extender
      this.renderer.setStyle(appFooter, 'margin-top', '-15px');
      this.renderer.setStyle(appFooter, 'position', 'relative');
      this.renderer.setStyle(appFooter, 'z-index', '1');
      
      // Change background color to match our theme
      this.renderer.setStyle(appFooter, 'background-color', 'rgba(5, 5, 15, 0.98)');
    }
    
    if (innerFooter) {
      // Remove borders to prevent lines
      this.renderer.setStyle(innerFooter, 'border-top', 'none');
      
      // Keep the padding for text but ensure good color match
      this.renderer.setStyle(innerFooter, 'background-color', 'rgba(5, 5, 15, 0.98)');
    }
  }
  
  resetFooterGap() {
    // Find the app-footer element
    const appFooter = document.querySelector('app-footer');
    
    // Find the inner footer element
    const innerFooter = document.querySelector('app-footer > footer');
    
    // Remove styles from app-footer
    if (appFooter) {
      this.renderer.removeStyle(appFooter, 'margin-top');
      this.renderer.removeStyle(appFooter, 'position');
      this.renderer.removeStyle(appFooter, 'z-index');
      this.renderer.removeStyle(appFooter, 'background-color');
    }
    
    // Remove styles from inner footer
    if (innerFooter) {
      this.renderer.removeStyle(innerFooter, 'border-top');
      this.renderer.removeStyle(innerFooter, 'background-color');
    }
  }

  private initScrollAnimation(): void {
    // Configure the intersection observer for scroll animations
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Once animation is triggered, no need to observe this element anymore
          this.scrollObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with the animateOnScroll attribute
    const animatedElements = document.querySelectorAll('[animateOnScroll]');
    animatedElements.forEach(element => {
      this.scrollObserver.observe(element);
    });
  }

  // Add randomization to meteor positions for more natural appearance
  private randomizeMeteors(): void {
    // Get all meteor elements
    const meteors = this.el.nativeElement.querySelectorAll('.meteor, .meteor-cta');
    
    // Randomize each meteor's position slightly - more aggressive randomization
    meteors.forEach((meteor: HTMLElement) => {
      try {
        // Apply initial opacity setting to ensure they're not visible initially
        this.renderer.setStyle(meteor, 'opacity', '0');
        
        // Get random offset values - more variation
        const topOffset = Math.floor(Math.random() * 20) - 40; // -40 to -20 (always off-screen)
        const leftOffset = Math.floor(Math.random() * 30) - 30; // -30 to 0 (start off-screen)
        
        // Apply new randomized position - always start off-screen
        this.renderer.setStyle(meteor, 'top', `${topOffset}%`);
        this.renderer.setStyle(meteor, 'left', `${leftOffset}%`);
        
        // Completely randomize animation delay
        const newDelay = Math.random() * 7; // 0-7 second delay 
        this.renderer.setStyle(meteor, 'animation-delay', `${newDelay}s`);
        
        // Add slight variation to animation duration
        const baseDuration = meteor.classList.contains('meteor-cta') ? 8 : 6;
        const durationOffset = (Math.random() * 2) - 1; // -1 to +1
        this.renderer.setStyle(meteor, 'animation-duration', `${baseDuration + durationOffset}s`);
        
        // Add slight rotation variation
        const rotationOffset = (Math.random() * 20) - 10; // -10 to +10 degrees
        this.renderer.setStyle(meteor, 'transform', `rotate(${-45 + rotationOffset}deg)`);
      } catch (error) {
        console.error('Error randomizing meteor:', error);
      }
    });
    
    // Set a timeout to ensure all meteors become part of the animation
    setTimeout(() => {
      meteors.forEach((meteor: HTMLElement) => {
        this.renderer.removeStyle(meteor, 'opacity');
      });
    }, 100);
  }
}
