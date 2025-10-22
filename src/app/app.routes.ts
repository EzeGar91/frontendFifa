import { Routes } from '@angular/router';
import { DashboardComponent } from '../../app/dashboard/dashboard.component';
import { PlayersComponent } from '../../app/players/players.components';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'players', component: PlayersComponent },
  { path: '**', redirectTo: '/dashboard' }
];
