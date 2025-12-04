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
    path: 'gestion',
    loadComponent: () => import('./Pages/gestion/gestion.page').then( m => m.GestionPage)
  },
  {
    path: 'platform',
    loadComponent: () => import('./Pages/platform/platform.page').then( m => m.PlatformPage)
  },
  {
    path: 'developer',
    loadComponent: () => import('./Pages/developer/developer.page').then( m => m.DeveloperPage)
  },
  {
    path: 'category',
    loadComponent: () => import('./Pages/category/category.page').then( m => m.CategoryPage)
  },
  {
    path: 'developer',
    loadComponent: () => import('./Pages/developer/developer.page').then( m => m.DeveloperPage)
  },
  {
    path: 'games',
    loadComponent: () => import('./Pages/games/games.page').then( m => m.GamesPage)
  },
  {
    path: 'wiki-detail/:id',
    loadComponent: () => import('./Pages/wiki-detail/wiki-detail.page').then( m => m.WikiDetailPage)
  },
  
];
