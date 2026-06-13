import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appBackgroundColor]',
})
export class BackgroundColorDirective {
  @Input()
  @HostBinding('style.backgroundColor')
  appBackgroundColor = '';
}
