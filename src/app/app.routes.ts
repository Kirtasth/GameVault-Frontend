import {Routes} from '@angular/router';
import {Login} from './features/login/login';
import {Register} from './features/register/register';
import {Home} from './features/home/home';
import {DeveloperRegistration} from './features/developer-registration/developer-registration';
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
  },

  {
    path: 'become-developer',
    component: DeveloperRegistration,
    title: 'GameVault - Become a Developer',
    canActivate: [AuthGuard]
  },

  {
    path: 'dev-tools',
    loadChildren: () => import('./features/dev-tools/dev-tools.routes').then(m => m.DEV_TOOLS_ROUTES),
    title: 'GameVault - Developer Tools',
    canActivate: [AuthGuard]
  },

  {path: '**', redirectTo: 'home'}

];
