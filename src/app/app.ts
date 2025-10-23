import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../app/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
