import { FormControl } from '@angular/forms';

export class AngularLib {
  constructor() { }

  public _filter(obj, opt1, value) {
    value = value ? value : '';
    const filterValue = value.toString().toLowerCase();
    return obj.filter(option => option[opt1].toString().toLowerCase().includes(filterValue));
  }

  public __filter(obj, opt1, opt2, value) {
    value = value ? value : '';
    const filterValue = value.toString().toLowerCase();
    return obj.filter(option => option[opt1].toString().toLowerCase().includes(filterValue) || option[opt2].toString().toLowerCase().includes(filterValue));
  }

  public _e_filter(obj, opt1, value) {
    const filterValue = value && value.toString().toLowerCase();
    return obj.filter(option => option[opt1].toString().toLowerCase() == filterValue);
  }

  public _find(obj, opt1, value) {
    const filterValue = value && value.toString().toLowerCase();
    return obj.find(x => x[opt1].toString().toLowerCase() == filterValue);
  }

  public __find(obj, opt1, opt2, value) {
    const filterValue = value && value.toString().toLowerCase();
    return obj.find(x => x[opt1].toString().toLowerCase() == filterValue || x[opt2].toString().toLowerCase() == filterValue);
  }

  public _space_validator(control: FormControl) {
    let isWhitespace = ((control.value && control.value.toString()) || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'required': true }
  }

  public _date_diff(to, from) {
    let diff = Math.floor(new Date(to).getTime() - new Date(from).getTime());
    let dayconverter = 1000 * 60 * 60 * 24;
    let days = (Math.floor(diff / dayconverter)) + 1;
    return days;
  }

  public _minute_diff(from) {
    let diff = Math.floor(new Date(from).getTime() - new Date().getTime());
    let dayconverter = 1000 * 60;
    let days = Math.floor(diff / dayconverter);
    return days;
  }

}
