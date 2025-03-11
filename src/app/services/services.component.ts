import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private scrollListener: (() => void) | undefined;
  private observer: IntersectionObserver | undefined;
  private animatedElements: Element[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    // Initialize any data if needed
  }

  ngAfterViewInit(): void {
    // Set up scroll animations with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.setupScrollAnimations();
      this.setupIntersectionObserver();
      this.adjustFooterMargin();
    }, 100);
  }
  
  // Specifically adjust the footer margin only for the services page
  private adjustFooterMargin(): void {
    const footer = document.querySelector('app-footer > footer');
    if (footer) {
      this.renderer.setStyle(footer, 'margin-top', '0');
    }
  }

  private setupScrollAnimations(): void {
    // Get all elements with the animateOnScroll attribute
    this.animatedElements = this.el.nativeElement.querySelectorAll('[animateOnScroll]');
    
    // Initial check for elements in viewport
    this.checkElementsInViewport();
    
    // Set up scroll listener
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.checkElementsInViewport();
    });
  }

  private setupIntersectionObserver(): void {
    // Set up IntersectionObserver for more efficient animation triggering
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.2 // 20% of the element visible
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate');
          // Remove observed elements once they've been animated
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe all animatable elements
    this.animatedElements.forEach(element => {
      this.observer?.observe(element);
    });
  }

  private checkElementsInViewport(): void {
    // Fallback for browsers that don't support IntersectionObserver
    if (!this.observer) {
      this.animatedElements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // Check if element is in viewport
        if (
          position.top < window.innerHeight && 
          position.bottom >= 0
        ) {
          this.renderer.addClass(element, 'animate');
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up scroll listener
    if (this.scrollListener) {
      this.scrollListener();
    }
    
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Reset footer margin when this component is destroyed
    const footer = document.querySelector('app-footer > footer');
    if (footer) {
      this.renderer.removeStyle(footer, 'margin-top');
    }
  }
}
