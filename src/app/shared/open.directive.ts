import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appOpen]'
})
export class OpenDirective {
  // constructor(private el: ElementRef) { }
  constructor() { }
  
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  // @HostListener('click') onClick() {
  //   this.el.nativeElement.classList.toggle('open');
  // }
}
