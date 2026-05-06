import {Routes} from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {DeveloperGuard} from './core/guards/developer.guard';
import {Shell} from './core/components/shell/shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
    title: 'GameVault - Login'
  },

  { path: 'register',
    loadComponent: () => import('./features/register/register').then(m => m.Register),
    title: 'GameVault - Register'
  },

  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.Home),
        title: 'GameVault - Home',
        pathMatch: 'full'
      },

      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then(m => m.Cart),
        title: 'GameVault - Cart',
      },

      {
        path: 'checkout/success',
        loadComponent: () => import('./features/checkout/checkout-success').then(m => m.CheckoutSuccess),
        title: 'GameVault - Payment Successful',
        canActivate: [AuthGuard],
      },

      {
        path: 'checkout/error',
        loadComponent: () => import('./features/checkout/checkout-error').then(m => m.CheckoutError),
        title: 'GameVault - Payment Failed',
        canActivate: [AuthGuard],
      },

      {
        path: 'purchased-games',
        loadComponent: () => import('./features/purchased-games/purchased-games').then(m => m.PurchasedGames),
        title: 'GameVault - Purchased Games',
        canActivate: [AuthGuard],
      },

      {
        path: 'become-developer',
        loadComponent: () => import('./features/developer-registration/developer-registration').then(m => m.DeveloperRegistration),
        title: 'GameVault - Become a Developer',
        canActivate: [AuthGuard],
      },

      {
        path: 'dev-tools',
        loadChildren: () => import('./features/dev-tools/dev-tools.routes').then(m => m.DEV_TOOLS_ROUTES),
        title: 'GameVault - Developer Tools',
        canActivate: [DeveloperGuard]
      },

      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
        title: 'GameVault - My Profile',
        canActivate: [AuthGuard],
      }
    ]
  },

  {path: '**', redirectTo: ''}

];
