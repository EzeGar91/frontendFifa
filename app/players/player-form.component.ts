import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html'
})
export class PlayerFormComponent implements OnInit {
  playerForm!: FormGroup;

  constructor(private fb: FormBuilder, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      nationality: ['', Validators.required],
      club: [''],
      overall: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      this.playerService.create(this.playerForm.value).subscribe({
        next: (res) => {
          console.log('Jugador creado:', res);
          this.playerForm.reset();
        },
        error: (err) => {
          console.error('Error al crear jugador:', err);
        }
      });
    }
  }
}
