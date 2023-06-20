import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const csrftoken = this.cookieService.get('csrftoken');
    const csrfReq = req.clone({
      headers: req.headers.set('X-CSRFToken', csrftoken),
    })

    return next.handle(csrfReq);
  }
}
