import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navbarEl') navbarEl!: ElementRef;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef>;
  
  private textElements: HTMLElement[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private navRect: DOMRect | null = null;
  private isMouseOverNav = false;
  private illuminationThreshold = 100; // Distance threshold for illumination in pixels

  constructor(private router: Router, private renderer: Renderer2) { }

  ngAfterViewInit() {
    // Collect all text elements in the navbar
    if (this.navbarEl) {
      this.navRect = this.navbarEl.nativeElement.getBoundingClientRect();
      
      // Get all text elements
      const logo = this.navbarEl.nativeElement.querySelector('.logo') as HTMLElement;
      const navItems = this.navbarEl.nativeElement.querySelectorAll('.nav-item');
      
      if (logo) this.textElements.push(logo);
      navItems.forEach((item: HTMLElement) => this.textElements.push(item));
      
      // Set initial state
      this.textElements.forEach(el => {
        this.renderer.addClass(el, 'text-dim');
      });
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.navbarEl) return;
    
    this.navRect = this.navbarEl.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX;
    if (this.navRect) {
      this.mouseY = event.clientY - this.navRect.top;
    }
    
    this.updateTextIllumination();
  }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.isMouseOverNav = true;
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isMouseOverNav = false;
    // Reset all text elements to dim
    this.textElements.forEach(el => {
      this.renderer.removeClass(el, 'text-illuminated');
      this.renderer.addClass(el, 'text-dim');
    });
  }
  
  private updateTextIllumination() {
    if (!this.isMouseOverNav || !this.navRect) return;
    
    this.textElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      // Calculate the center of the element
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance between mouse and element
      const distance = Math.sqrt(
        Math.pow(this.mouseX - centerX, 2) + 
        Math.pow(this.mouseY - (rect.top - this.navRect!.top + rect.height / 2), 2)
      );
      
      // Determine illumination intensity based on distance
      if (distance < this.illuminationThreshold) {
        // Close enough to illuminate
        const intensity = 1 - (distance / this.illuminationThreshold);
        
        // Apply intense illumination if very close
        if (intensity > 0.7) {
          this.renderer.removeClass(el, 'text-dim');
          this.renderer.addClass(el, 'text-illuminated');
        } else {
          this.renderer.removeClass(el, 'text-illuminated');
          this.renderer.removeClass(el, 'text-dim');
          
          // Apply custom style based on distance
          this.renderer.setStyle(el, 'color', `rgba(255, 255, 255, ${0.7 + (intensity * 0.3)})`);
          this.renderer.setStyle(el, 'text-shadow', `0 0 ${intensity * 10}px rgba(255, 255, 255, ${intensity * 0.8})`);
        }
      } else {
        // Too far to be illuminated
        this.renderer.removeClass(el, 'text-illuminated');
        this.renderer.addClass(el, 'text-dim');
        this.renderer.removeStyle(el, 'text-shadow');
        this.renderer.removeStyle(el, 'color');
      }
    });
  }
}
