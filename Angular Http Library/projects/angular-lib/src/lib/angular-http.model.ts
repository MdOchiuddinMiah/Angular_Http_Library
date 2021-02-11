import { FormControl } from '@angular/forms';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { map, share, catchError, debounceTime } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

export class AngularHttp {
  constructor() { }

  public _canActivate(obj) {
    let isAuthorized = false;
    obj && obj.token &&
      (isAuthorized = true);
    return isAuthorized;
  }

  public _encrypt(value: string, specialChar, EDKey): string {
    let eValue = CryptoJS.AES.encrypt(value, EDKey.trim()).toString();
    specialChar.forEach((x, i) => {
      eValue = eValue.replace(new RegExp(x, 'g'), '_' + i + '_' + x.charCodeAt(0));
    });
    return eValue;
  }

  public _decrypt(textToDecrypt: string, specialChar, EDKey) {
    specialChar.forEach((x, i) => {
      textToDecrypt = textToDecrypt.replace(new RegExp('_' + i + '_' + x.charCodeAt(0), 'g'), x);
    });
    return CryptoJS.AES.decrypt(textToDecrypt, EDKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  public _headers(opt, obj, contentType) {
    opt = opt || {};
    opt['headers'] = opt.headers || new Headers();
    // set content type
    opt.headers.append('Content-Type', contentType);
    if (obj && obj.userCode && obj.token) {
      opt.headers.append('token', obj.token);
      opt.headers.append('userCode', obj.userCode);
      opt.headers.append('branchCode', obj.currentBranchCode || obj.branchCode || '');
    }
    return opt;
  }

  public _snakecase(obj: Object) {
    let _regex = /([a-z])([A-Z])/g;

    return obj ? Object.keys(obj).reduce((output, item) => {
      output[item.replace(_regex, '$1_$2').toLowerCase()] = obj[item];
      return output;
    }, {}) : obj;
  }

  public _serialize(obj: any): string {
    return JSON.stringify(obj) || '{}';
  }

  public _deserialize(res: Observable<Response>): any {
    return res
      .pipe(map(res => {
        let data = res['_body'] && res.json() || {};
        return (data);
      }), catchError(res => {
        if (res.status >= 500 && res.status < 600) {
          let data: any;
          try {
            data = res.json() || {};
          } catch (e) {
            data = this._error(res.text(), res.status);
          }
          return Observable.throw(res.text());
        }
        if (res.status >= 400 && res.status < 500) {
          let data = res.json() || {};
          return Observable.throw(data);
        }
        return Observable.throw(res.text());
      }));
  }

  public _encode(params?: any): URLSearchParams {
    if (params instanceof URLSearchParams) return params;
    let searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => params[key] !== null && searchParams.set(key, params[key]));
    return searchParams;
  }

  public _error(message: string, status: number = 400): any {
    return {
      error: {
        code: status,
        message: message || 'Server error (${status})',
      }
    };
  }

  public _getHTTPURL(url: string) {
    return window.location.protocol + '//' + url;
  }

}
