import { Component, ElementRef, OnInit, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    console.log('Home component initialized');
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit - Basic initialization complete');
    
    // Apply immediate visibility to all elements
    setTimeout(() => {
      // Force all elements to be visible
      const allSections = document.querySelectorAll('section');
      allSections.forEach(section => {
        this.renderer.setStyle(section, 'opacity', '1');
        this.renderer.setStyle(section, 'visibility', 'visible');
      });

      // Force all containers to be visible
      const allContainers = document.querySelectorAll('.container');
      allContainers.forEach(container => {
        this.renderer.setStyle(container, 'opacity', '1');
        this.renderer.setStyle(container, 'visibility', 'visible');
      });
    }, 100);
  }

  // Simple navigation method for links
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
