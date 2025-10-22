import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../services/player.service';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class PlayersComponent implements OnInit {
  playerForm!: FormGroup;
  players: Player[] = [];

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

  constructor(private fb: FormBuilder, private playerService: PlayerService) {}

  ngOnInit() {
    this.playerForm = this.fb.group({
      long_name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(1)]],
      nationality_name: [''],
      club_name: [''],
      player_positions: [''],
      overall: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      potential: [50, [Validators.min(0), Validators.max(100)]],
      value_eur: [0, [Validators.min(0)]],
      wage_eur: [0, [Validators.min(0)]],
      height_cm: [0, [Validators.min(0)]],
      weight_kg: [0, [Validators.min(0)]],
      preferred_foot: [''],
      work_rate: ['']
    });

    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getAll().subscribe(response => this.players = response.data);
  }

  onSubmit() {
    if (this.playerForm.valid) {
      this.playerService.create(this.playerForm.value).subscribe(() => {
        this.playerForm.reset();
        this.loadPlayers();
      });
    }
  }

  deletePlayer(id: number) {
    this.playerService.delete(id).subscribe(() => this.loadPlayers());
  }
}
