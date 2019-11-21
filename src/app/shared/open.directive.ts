import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appOpen]'
})
export class OpenDirective {
  constructor(private el: ElementRef) { }
  
  @HostBinding('class.open') isOpen = false;

  // opens when click on host element and closes dropdown when click anywhere (outside or inside of host el.) 
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.el.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }

  // @HostListener('click') onClick() {
  //   this.el.nativeElement.classList.toggle('open');
  // }
}
