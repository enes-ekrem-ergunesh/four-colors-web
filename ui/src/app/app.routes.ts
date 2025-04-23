import {Routes} from '@angular/router';
import {PageNotFoundPage} from "./pages/page-not-found/page-not-found.page";
import {adminAuthGuard} from "./admin/guards/admin-auth-guard/admin-auth.guard";
import {adminNoAuthGuard} from "./admin/guards/admin-no-auth-guard/admin-no-auth.guard";
import {userAuthGuard} from "./guards/user-auth-guard/user-auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then( m => m.ContactPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'my',
    loadComponent: () => import('./pages/my/my.page').then( m => m.MyPage),
    canActivate: [userAuthGuard]
  },
  {
    path: 'admin',
    redirectTo: 'admin-home',
    pathMatch: 'full',
  },
  {
    path: 'admin-home',
    loadComponent: () => import('./admin/pages/admin-home/admin-home.page').then(m => m.AdminHomePage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin/pages/admin-login/admin-login.page').then(m => m.AdminLoginPage),
    canActivate: [adminNoAuthGuard]
  },
  {
    path: 'admin-students',
    loadComponent: () => import('./admin/pages/admin-students/admin-students.page').then( m => m.AdminStudentsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-teachers',
    loadComponent: () => import('./admin/pages/admin-teachers/admin-teachers.page').then( m => m.AdminTeachersPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/page-not-found/page-not-found.page').then(m => m.PageNotFoundPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
];
