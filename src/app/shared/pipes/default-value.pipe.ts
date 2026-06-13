import { Pipe, PipeTransform } from '@angular/core';

export enum DefaultValues {
  Dash = '-',
}

@Pipe({
  name: 'defaultValue',
})
export class DefaultValuePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return value ?? DefaultValues.Dash;
  }
}
