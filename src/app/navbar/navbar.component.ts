import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  // Mobile menu state
  mobileMenuOpen = false;
  isMobileView = false;
  
  constructor() { }

  ngOnInit() {
    // Set mobile view state immediately on component initialization
    this.checkMobileView();
  }
  
  ngAfterViewInit() {
    // Double check mobile view after view initialization
    this.checkMobileView();
  }
  
  // Handle window resize
  @HostListener('window:resize')
  handleResize() {
    this.checkMobileView();
    // Close menu on resize to desktop
    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
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
