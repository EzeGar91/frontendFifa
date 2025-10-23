import { Routes } from '@angular/router';
import { DashboardComponent } from '../../app/dashboard/dashboard.component';
import { PlayersComponent } from '../../app/players/players.components';
import { PlayerDetailComponent } from '../../app/player-detail/player-detail.component';
import { LoginComponent } from '../../app/login/login.component';
import { AuthGuard } from '../../app/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'players', 
    component: PlayersComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'player/:id', 
    component: PlayerDetailComponent,
    canActivate: [AuthGuard],
    // Deshabilitar prerendering para rutas con parámetros dinámicos
    data: { preload: false }
  },
  { path: '**', redirectTo: '/login' }
];
