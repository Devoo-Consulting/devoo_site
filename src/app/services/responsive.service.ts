import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

export enum ScreenSize {
  XS = 'xs',  // < 576px
  SM = 'sm',  // >= 576px
  MD = 'md',  // >= 768px
  LG = 'lg',  // >= 992px
  XL = 'xl'   // >= 1200px
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private currentScreenSize = new BehaviorSubject<ScreenSize>(this.getScreenSize());
  
  constructor() {
    // Listen for window resize events
    fromEvent(window, 'resize')
      .pipe(
        map(() => this.getScreenSize()),
        startWith(this.getScreenSize()),
        distinctUntilChanged()
      )
      .subscribe(size => {
        this.currentScreenSize.next(size);
      });
  }
  
  /**
   * Get the current screen size as an observable
   */
  public screenSize$(): Observable<ScreenSize> {
    return this.currentScreenSize.asObservable();
  }
  
  /**
   * Check if the current screen matches a given size or smaller
   */
  public isScreenSizeOrSmaller(size: ScreenSize): boolean {
    const currentSize = this.getScreenSize();
    return this.compareScreenSizes(currentSize, size) <= 0;
  }
  
  /**
   * Check if the current screen matches a given size or larger
   */
  public isScreenSizeOrLarger(size: ScreenSize): boolean {
    const currentSize = this.getScreenSize();
    return this.compareScreenSizes(currentSize, size) >= 0;
  }
  
  /**
   * Get the current screen size based on window width
   */
  private getScreenSize(): ScreenSize {
    const width = window.innerWidth;
    
    if (width < 576) {
      return ScreenSize.XS;
    } else if (width < 768) {
      return ScreenSize.SM;
    } else if (width < 992) {
      return ScreenSize.MD;
    } else if (width < 1200) {
      return ScreenSize.LG;
    } else {
      return ScreenSize.XL;
    }
  }
  
  /**
   * Compare two screen sizes
   * Returns: -1 if a < b, 0 if a === b, 1 if a > b
   */
  private compareScreenSizes(a: ScreenSize, b: ScreenSize): number {
    const sizeValues = {
      [ScreenSize.XS]: 0,
      [ScreenSize.SM]: 1,
      [ScreenSize.MD]: 2,
      [ScreenSize.LG]: 3,
      [ScreenSize.XL]: 4
    };
    
    return sizeValues[a] - sizeValues[b];
  }
} 