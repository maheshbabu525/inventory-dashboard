import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/shared/services/auth.service';

// Functional JWT interceptor: attaches the stored token to every outgoing request.
// Without this, protected endpoints (sell, search-all, analytics) always come back
// 401/403 even right after a successful login, since the backend never sees the token.
const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}).catch(err => console.error(err));
