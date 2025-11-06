
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // FIX: Correctly navigate by ensuring router type is not unknown. The original error points to a type inference issue.
  (router as Router).navigate(['/admin/login']);
  return false;
};
