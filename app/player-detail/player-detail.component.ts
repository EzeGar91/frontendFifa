import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../services/player.service';
import { Player } from '../models/player.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  @ViewChild('radarChart', { static: true }) radarChartRef!: ElementRef<HTMLCanvasElement>;
  
  player: Player | null = null;
  isLoading = false;
  error: string | null = null;
  playerForm!: FormGroup;
  radarChart: Chart | null = null;

  // Configuración de skills para el radar chart
  skillCategories = {
    'Skills Principales': ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical']
  };

  selectedCategory = 'Skills Principales';

  // Exponer Object para usar en el template
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private playerService: PlayerService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.initializeForm();
    this.loadPlayer();
  }

  ngOnDestroy() {
    if (this.radarChart) {
      this.radarChart.destroy();
    }
  }

  private initializeForm() {
    this.playerForm = this.fb.group({
      category: ['Skills Principales']
    });

    this.playerForm.get('category')?.valueChanges.subscribe(category => {
      this.selectedCategory = category;
      if (this.player) {
        this.createRadarChart();
      }
    });
  }

  private loadPlayer() {
    const playerId = this.route.snapshot.paramMap.get('id');
    if (!playerId) {
      this.error = 'ID de jugador no válido';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.playerService.getById(+playerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.player = response.data;
          this.createRadarChart();
          this.isLoading = false;
        } else {
          this.error = 'Error al cargar el jugador';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error cargando jugador:', error);
        this.error = 'Error al cargar el jugador';
        this.isLoading = false;
      }
    });
  }

  private createRadarChart() {
    if (!this.player || !this.radarChartRef) return;

    // Destruir el chart anterior si existe
    if (this.radarChart) {
      this.radarChart.destroy();
    }

    const skills = this.skillCategories[this.selectedCategory as keyof typeof this.skillCategories];
    const labels = this.getSkillLabels(skills);
    const data = skills.map(skill => this.player![skill as keyof Player] as number || 0);

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: this.player.name,
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Skills de ${this.player.name} - ${this.selectedCategory}`,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 11,
                weight: 'bold'
              }
            }
          }
        },
        elements: {
          line: {
            borderWidth: 3
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    });
  }

  private getSkillLabels(skills: string[]): string[] {
    const skillLabels: { [key: string]: string } = {
      // Skills principales
      'pace': 'Velocidad',
      'shooting': 'Disparo',
      'passing': 'Pase',
      'dribbling': 'Regate',
      'defending': 'Defensa',
      'physical': 'Físico'
    };

    return skills.map(skill => skillLabels[skill] || skill);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getOverallColor(overall: number): string {
    if (overall >= 90) return 'overall-legendary';
    if (overall >= 85) return 'overall-world-class';
    if (overall >= 80) return 'overall-excellent';
    if (overall >= 75) return 'overall-very-good';
    if (overall >= 70) return 'overall-good';
    return 'overall-average';
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
