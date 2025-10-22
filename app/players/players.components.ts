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
      name: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(1)]],
      nationality: [''],
      club: [''],
      position: [''],
      overall: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    });

    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getAll().subscribe(data => this.players = data);
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
