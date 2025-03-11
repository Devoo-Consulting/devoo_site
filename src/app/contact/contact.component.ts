import { Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChildren('[animateOnScroll]', { read: ElementRef }) animatedElements!: QueryList<ElementRef>;
  isMobile: boolean = false;

  constructor(
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
    this.forceTextVisibility();
    this.fixFooterConnection();
    this.adjustHeroHeight();
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    // Set page title and meta description
    this.titleService.setTitle('Contact Us | Devoo Consulting');
    this.metaService.updateTag({ name: 'description', content: 'Get in touch with Devoo Consulting. We provide innovative software solutions and expert consulting services for your business needs.' });
    
    // Check if mobile on init
    this.checkIfMobile();
    
    // Force visibility of text elements
    this.forceTextVisibility();
    
    // Fix footer connection
    this.fixFooterConnection();
    
    // Adjust hero height to fit screen
    this.adjustHeroHeight();
  }

  ngAfterViewInit(): void {
    // Initialize animations
    this.initScrollAnimation();
    
    // Force visibility on elements after view init
    setTimeout(() => {
      this.forceTextVisibility();
      this.fixFooterConnection();
      this.adjustHeroHeight();
    }, 500);

    // And again after 1 second to ensure everything is visible
    setTimeout(() => {
      this.forceTextVisibility();
      this.fixFooterConnection();
      this.adjustHeroHeight();
    }, 1000);
  }

  initScrollAnimation(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Apply the animation class to the element
          this.renderer.addClass(entry.target, 'fadeInUp');
          
          // Add a specific class based on the element's position (if not mobile)
          if (!this.isMobile) {
            if (entry.boundingClientRect.left < window.innerWidth / 2) {
              this.renderer.addClass(entry.target, 'fadeInLeft');
            } else {
              this.renderer.addClass(entry.target, 'fadeInRight');
            }
          }
          
          // Set text color forcefully
          this.renderer.setStyle(entry.target, 'color', '#ffffff');
          this.renderer.setStyle(entry.target, 'visibility', 'visible');
          this.renderer.setStyle(entry.target, 'opacity', '1');
          
          // Unobserve the element after animating it
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with the animateOnScroll attribute
    this.animatedElements.forEach(element => {
      observer.observe(element.nativeElement);
    });
  }

  adjustHeroHeight(): void {
    // Get the hero section
    const heroSection = document.querySelector('.contact-hero');
    if (heroSection) {
      // Get the viewport height
      const viewportHeight = window.innerHeight;
      
      // Set hero height to match viewport height
      this.renderer.setStyle(heroSection, 'height', `${viewportHeight}px`);
      this.renderer.setStyle(heroSection, 'min-height', `${viewportHeight}px`);
      
      // Adjust font sizes based on viewport height
      const heroTitle = document.querySelector('.hero-title');
      const heroSubtitle = document.querySelector('.hero-subtitle');
      
      if (heroTitle && heroSubtitle) {
        // Scale font sizes based on viewport height and device
        if (this.isMobile) {
          this.renderer.setStyle(heroTitle, 'font-size', `${viewportHeight * 0.04}px`);
          this.renderer.setStyle(heroSubtitle, 'font-size', `${viewportHeight * 0.02}px`);
          
          // Adjust the hero container for mobile to make sure everything fits
          const heroContainer = document.querySelector('.contact-hero .container');
          if (heroContainer) {
            this.renderer.setStyle(heroContainer, 'padding-top', '2rem');
            this.renderer.setStyle(heroContainer, 'justify-content', 'flex-start');
            this.renderer.setStyle(heroContainer, 'height', '100%');
            this.renderer.setStyle(heroContainer, 'overflow-y', 'auto');
          }
        } else {
          this.renderer.setStyle(heroTitle, 'font-size', `${viewportHeight * 0.06}px`);
          this.renderer.setStyle(heroSubtitle, 'font-size', `${viewportHeight * 0.025}px`);
        }
      }
      
      // Adjust contact cards in hero section
      const contactCards = document.querySelectorAll('.contact-hero .contact-card');
      if (contactCards && contactCards.length > 0) {
        contactCards.forEach(card => {
          if (this.isMobile) {
            // Make cards smaller on mobile
            this.renderer.setStyle(card, 'padding', '1.2rem');
            this.renderer.setStyle(card, 'margin-bottom', '1rem');
            
            // Make card titles smaller
            const cardTitle = card.querySelector('.contact-card-title');
            if (cardTitle) {
              this.renderer.setStyle(cardTitle, 'font-size', '1.4rem');
              this.renderer.setStyle(cardTitle, 'margin-bottom', '1rem');
            }
          } else {
            // Add hover effect on desktop
            card.addEventListener('mouseenter', () => {
              this.renderer.setStyle(card, 'transform', 'translateY(-5px)');
            });
            
            card.addEventListener('mouseleave', () => {
              this.renderer.setStyle(card, 'transform', 'translateY(0)');
            });
          }
        });
      }
    }
  }

  forceTextVisibility(): void {
    // Force all text elements to be visible with explicit styling
    const textElements = document.querySelectorAll('h1, h2, h3, p, a, span');
    textElements.forEach(element => {
      this.renderer.setStyle(element, 'color', '#ffffff');
      this.renderer.setStyle(element, 'visibility', 'visible');
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'position', 'relative');
      this.renderer.setStyle(element, 'z-index', '10');
    });
    
    // Specific elements that might need extra attention
    const titles = document.querySelectorAll('.hero-title, .contact-card-title, .section-title, .benefit-title, .cta-title');
    titles.forEach(element => {
      this.renderer.setStyle(element, 'color', '#ffffff');
      this.renderer.setStyle(element, 'font-weight', '700');
      this.renderer.setStyle(element, 'z-index', '20');
    });
    
    const subtitles = document.querySelectorAll('.hero-subtitle, .contact-card-description, .benefit-description, .cta-text');
    subtitles.forEach(element => {
      this.renderer.setStyle(element, 'color', 'rgba(255, 255, 255, 0.9)');
      this.renderer.setStyle(element, 'z-index', '20');
    });

    // Make sure the last section has no bottom gap
    const ctaSection = document.querySelector('.cta.no-bottom-gap');
    if (ctaSection) {
      this.renderer.setStyle(ctaSection, 'margin-bottom', '0');
      this.renderer.setStyle(ctaSection, 'padding-bottom', '0');
    }

    const ctaActions = document.querySelector('.cta-actions');
    if (ctaActions) {
      const paddingBottom = this.isMobile ? '4rem' : '5rem';
      this.renderer.setStyle(ctaActions, 'padding-bottom', paddingBottom);
      this.renderer.setStyle(ctaActions, 'margin-bottom', '0');
    }
  }
  
  fixFooterConnection(): void {
    // Ensure host component connects properly to footer
    const hostElement = document.querySelector('app-contact');
    if (hostElement) {
      this.renderer.setStyle(hostElement, 'margin-bottom', '-1px');
      this.renderer.setStyle(hostElement, 'overflow', 'hidden');
    }
    
    // Find footer and ensure no gap
    const footer = document.querySelector('app-footer');
    if (footer) {
      this.renderer.setStyle(footer, 'margin-top', '0');
    }
    
    // Make sure there's no white space between sections
    const connectionElement = document.querySelector('.cta.no-bottom-gap > div:last-child');
    if (connectionElement) {
      this.renderer.setStyle(connectionElement, 'background', 'rgba(5, 5, 15, 0.98)');
      this.renderer.setStyle(connectionElement, 'height', '50px');
      this.renderer.setStyle(connectionElement, 'position', 'absolute');
      this.renderer.setStyle(connectionElement, 'bottom', '-1px');
      this.renderer.setStyle(connectionElement, 'width', '100%');
      this.renderer.setStyle(connectionElement, 'z-index', '6');
    }
  }
}
