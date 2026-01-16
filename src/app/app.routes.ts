import {Routes} from '@angular/router';
import {Login} from './features/login/login';
import {Register} from './features/register/register';
import {Home} from './features/home/home';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'GameVault - Login'
  },

  { path: 'register',
    component: Register,
    title: 'GameVault - Register'
  },

  {
    path: 'home',
    component: Home,
    title: 'GameVault - Home',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'home',
        component: Home,
        title: 'GameVault - Home'
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },

  {path: '**', redirectTo: 'home'}

];
