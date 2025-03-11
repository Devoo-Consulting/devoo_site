import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
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
  
  constructor(public router: Router) { }

  ngOnInit() {
    // Set mobile view state immediately on component initialization
    this.checkMobileView();
  }
  
  ngAfterViewInit() {
    // Double check mobile view after view initialization
    this.checkMobileView();
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
  
  ngOnDestroy() {
    // Cleanup if needed
  }
}
