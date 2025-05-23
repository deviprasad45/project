import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  @Input()
  public appAutoFocus: boolean = false;

  constructor(private el: ElementRef) { }

  public ngAfterContentInit() {
    this.el.nativeElement.focus();
  }

}
