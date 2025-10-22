import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService, PlayerFilters } from '../services/player.service';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class DashboardComponent implements OnInit {
  searchForm!: FormGroup;
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  isLoading = false;
  totalResults = 0;

  // Opciones para el dropdown de posiciones
  positions = [
    'Portero',
    'Defensor',
    'Mediocampista',
    'Delantero',
    'Lateral Derecho',
    'Lateral Izquierdo',
    'Central',
    'Volante',
    'Extremo',
    'Centro delantero'
  ];

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadAllPlayers();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      name: [''],
      club: [''],
      position: ['']
    });

    // Suscribirse a cambios en el formulario para búsqueda en tiempo real
    this.searchForm.valueChanges.subscribe(() => {
      this.searchPlayers();
    });
  }

  private loadAllPlayers() {
    this.isLoading = true;
    this.playerService.getAll().subscribe({
      next: (data) => {
        this.players = data;
        this.filteredPlayers = data;
        this.totalResults = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando jugadores:', error);
        this.isLoading = false;
      }
    });
  }

  searchPlayers() {
    const filters: PlayerFilters = this.searchForm.value;
    
    // Filtrar campos vacíos
    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof PlayerFilters]) {
        delete filters[key as keyof PlayerFilters];
      }
    });

    // Si no hay filtros, mostrar todos los jugadores
    if (Object.keys(filters).length === 0) {
      this.filteredPlayers = this.players;
      this.totalResults = this.players.length;
      return;
    }

    this.isLoading = true;
    this.playerService.getFiltered(filters).subscribe({
      next: (data) => {
        this.filteredPlayers = data;
        this.totalResults = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.isLoading = false;
      }
    });
  }

  clearFilters() {
    this.searchForm.reset();
    this.filteredPlayers = this.players;
    this.totalResults = this.players.length;
  }

  downloadCSV() {
    const filters: PlayerFilters = this.searchForm.value;
    
    // Filtrar campos vacíos
    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof PlayerFilters]) {
        delete filters[key as keyof PlayerFilters];
      }
    });

    this.playerService.downloadCSV(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jugadores_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error descargando CSV:', error);
        alert('Error al descargar el archivo CSV');
      }
    });
  }

  getPositionClass(position: string): string {
    const positionMap: { [key: string]: string } = {
      'Portero': 'position-goalkeeper',
      'Defensor': 'position-defender',
      'Mediocampista': 'position-midfielder',
      'Delantero': 'position-forward',
      'Lateral Derecho': 'position-fullback',
      'Lateral Izquierdo': 'position-fullback',
      'Central': 'position-center',
      'Volante': 'position-midfielder',
      'Extremo': 'position-winger',
      'Centro delantero': 'position-striker'
    };
    return positionMap[position] || 'position-default';
  }
}
