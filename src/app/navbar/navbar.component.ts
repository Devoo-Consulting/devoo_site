import { Component, OnInit, AfterViewInit, HostListener, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  // Mobile menu state
  mobileMenuOpen = false;
  isMobileView = false;
  menuClosing = false;
  
  // References to DOM elements for particle-logo interaction
  @ViewChild('navbarLogo') logoElement!: ElementRef;
  @ViewChild('navbarEl') navbarElement!: ElementRef;
  
  // Animation frame handle for cleanup
  private animationFrameId = 0;
  
  constructor(public router: Router) { }

  ngOnInit() {
    // Set mobile view state immediately on component initialization
    this.checkMobileView();
  }
  
  ngAfterViewInit() {
    // Double check mobile view after view initialization
    this.checkMobileView();
    
    // Start the particle-logo interaction animation
    this.startParticleLogoInteraction();
  }
  
  // Toggle mobile menu with animation support
  toggleMobileMenu() {
    if (!this.mobileMenuOpen) {
      // Opening the menu
      this.mobileMenuOpen = true;
      this.menuClosing = false;
    } else {
      // Closing the menu with animation
      this.closeMenu();
    }
  }
  
  // Close the mobile menu with animation and optional navigation
  closeMenu(route?: string) {
    if (this.mobileMenuOpen) {
      this.menuClosing = true;
      
      // Wait for animation to complete before hiding the menu
      setTimeout(() => {
        this.mobileMenuOpen = false;
        this.menuClosing = false;
        
        // Navigate to the route if provided (after animation)
        if (route) {
          this.router.navigate([route]);
        }
      }, 300); // Match animation duration
    }
  }
  
  // Handle window resize
  @HostListener('window:resize')
  handleResize() {
    this.checkMobileView();
    // Close menu on resize to desktop
    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.menuClosing = false;
    }
  }
  
  // Check if we're on mobile view
  checkMobileView() {
    const wasMobile = this.isMobileView;
    this.isMobileView = window.innerWidth <= 768;
    
    // Log state change for debugging
    if (wasMobile !== this.isMobileView) {
      console.log('Mobile view changed to:', this.isMobileView);
    }
  }
  
  // Particle and logo interaction animation
  startParticleLogoInteraction() {
    if (!this.logoElement) return;
    
    const particles = this.navbarElement.nativeElement.querySelectorAll('.navbar-particle');
    const logo = this.logoElement.nativeElement;
    
    const checkCollision = () => {
      if (!logo) return;
      
      const logoRect = logo.getBoundingClientRect();
      
      particles.forEach((particle: HTMLElement) => {
        const particleRect = particle.getBoundingClientRect();
        
        // Check for intersection between particle and logo
        const isColliding = !(
          particleRect.right < logoRect.left || 
          particleRect.left > logoRect.right || 
          particleRect.bottom < logoRect.top || 
          particleRect.top > logoRect.bottom
        );
        
        // Apply glow class when colliding
        if (isColliding) {
          logo.classList.add('logo-glow');
        } else {
          // Check if no particles are colliding before removing the glow
          const nodeArray = Array.from(particles);
          const anyParticleColliding = nodeArray.some(p => {
            const pRect = (p as Element).getBoundingClientRect();
            return !(
              pRect.right < logoRect.left || 
              pRect.left > logoRect.right || 
              pRect.bottom < logoRect.top || 
              pRect.top > logoRect.bottom
            );
          });
          
          if (!anyParticleColliding) {
            logo.classList.remove('logo-glow');
          }
        }
      });
      
      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(checkCollision);
    };
    
    // Start the animation loop
    this.animationFrameId = requestAnimationFrame(checkCollision);
  }
  
  ngOnDestroy() {
    // Clean up animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
