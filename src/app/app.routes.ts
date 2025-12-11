import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    loadComponent: () => import('./Pages/index/index.page').then( m => m.IndexPage)
  },
   {
    path: 'login',
    loadComponent: () => import('./Pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'wikis',
    loadComponent: () => import('./Pages/wikis/wikis.page').then( m => m.WikisPage)
  },
  {
    path: 'second-factor',
    loadComponent: () => import('./Pages/second-factor/second-factor.page').then( m => m.SecondFactorPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./Pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'wiki-detail/:id',
    loadComponent: () => import('./Pages/wiki-detail/wiki-detail.page').then( m => m.WikiDetailPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./Pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./Pages/favorites/favorites.page').then( m => m.FavoritesPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./Pages/notification/notification.page').then( m => m.NotificationPage)
  },
  
];
