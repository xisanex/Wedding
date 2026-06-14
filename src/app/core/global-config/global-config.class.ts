import { formatDate } from '@angular/common';

export class GlobalConfig {
  /** Date format for backend, Angular Material also can manage this format */
  public static readonly NATIVE_DATE_FORMAT: string = 'yyyy-MM-dd';

  /** Date format for display */
  public static readonly DISPLAY_DATE_FORMAT: string = 'dd.MM.yyyy';

  /** Date locale */
  public static readonly DATE_LOCALE: string = 'pl-PL';

  /** Date conversion before send date to API */
  public static saveDateToAPI(date: Date): string {
    return formatDate(date, GlobalConfig.NATIVE_DATE_FORMAT, GlobalConfig.DATE_LOCALE);
  }

  /** Date conversion to display format */
  public static setDisplayDate(date: string) {
    return formatDate(date, GlobalConfig.NATIVE_DATE_FORMAT, GlobalConfig.DATE_LOCALE);
  }
}
