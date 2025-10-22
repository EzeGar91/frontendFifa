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
  
  // Paginación
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  displayedPlayers: Player[] = [];

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
      next: (response) => {
        this.players = response.data;
        this.filteredPlayers = response.data;
        this.totalResults = response.count;
        this.updatePagination();
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
      next: (response) => {
        this.filteredPlayers = response.data;
        this.totalResults = response.count;
        this.currentPage = 1; // Reset a la primera página
        this.updatePagination();
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
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPlayers = this.filteredPlayers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
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
