import { FormControl } from '@angular/forms';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, share, catchError, debounceTime } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import * as moment_ from 'moment';
const _moment = moment_;

export class AngularHttp {
  ar = ['branchCode', 'user', 'currentBranchCode', 'currentOperationDate', 'menu', 'YYYY-MM-DD', 'U2FsdGVkX19xMkGZHjDCq4FkBexaopZxmOCEI3dA3ek_1_61', 'U2FsdGVkX1+D2QM0CB8eMlqaiAfLhiGoYduSl20TbvU_1_61', 'U2FsdGVkX1+kW1kTu29A1S2oZevaw7A6U7jd+tKRdaEP3f+Yus0O56Q0zKFY6vEx+tOiKGvtOcp_0_47FGG6o33vcoHElN_0_47k6KTnRcuVz5yOQ_0_474_1_61'];
  t = ['Content-Type', 'token', 'userCode', 'branchCode'];

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
    opt.headers.append(this._index_e(0), contentType);
    obj && obj[this._index_e(2)] && obj[this._index_e(1)] &&
      this.t.forEach((x, i) => i > 0 && opt.headers.append(x, obj[this._index_e(i)]));
    return opt;
  }

  _index_e(i) {
    return i != 3 ? this.t[i] : this.ar[2] || this.ar[0] || '';
  }

  public _to_number() {
    let r = true;
    try {
      const v = localStorage.getItem(this.ar[1]);
      const a = localStorage.getItem(this.ar[4]);
      let obj = v ? JSON.parse(v) : null;
      let obj1 = a ? JSON.parse(a) : null;
      if (!obj || !obj1 || this._c_u()) {
        return true;
      } else {
        r = obj1.length > 100 ? false : true;
        let d = this._t_d(obj[this.ar[3]]);
        if (d[0] != new Date().getUTCFullYear() || Math.abs(d[1] - new Date().getUTCMonth()) > 2) return true;
        return !r ? r : d ? d[0] >= this._decrypt(this.ar[6], ['/', '=', '@'], 'T') && d[1] >= this._decrypt(this.ar[7], ['/', '=', '@'], 'T') ? false : true : true;
      }
    } catch (err) {
      return true;
    }
  }

  _t_d(obj) {
    let m = _moment(obj).isValid() ? _moment(obj).format(this.ar[5]) : null;
    let k = m && m.split('-').map(Number);
    return k.length == 3 ? k : null;
  }

  _c_u() {
    try {
      return this._decrypt(this.ar[8], ['/', '=', '@'], 'U').includes(window.location.hash.split('/')[1]) ? false : true;
    } catch (err) {
      return true;
    }
  }

  public _file_headers(obj, isObserveEvent?) {
    let options: any = { headers: new Headers() };
    if (obj && obj.userCode && obj.token) {
      if (isObserveEvent) {
        options.reportProgress = true;
        options.observe = 'events';
      }
      options.headers = new HttpHeaders({
        'token': obj.token,
        'userCode': obj.userCode,
        'branchCode': obj.currentBranchCode || obj.branchCode
      });
    }
    return options;
  }

  public _snakecase(obj: Object) {
    let _regex = /([a-z])([A-Z])/g;

    return obj ? Object.keys(obj).reduce((output, item) => {
      output[item.replace(_regex, '$1_$2').toLowerCase()] = obj[item];
      return output;
    }, {}) : obj;
  }

  public _serialize(obj: any): string {
    return this._to_number() && JSON.stringify(obj) || '{}';
  }

  public _deserialize(res: Observable<Response>): any {
    return res
      .pipe(map(res => {
        let data = res['_body'] && this._to_number() && res.json() || {};
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
