import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player, PlayerResponse } from '../models/player.model';
import { Observable } from 'rxjs';

export interface PlayerFilters {
  name?: string;
  club?: string;
  position?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlayerResponse> {
    return this.http.get<PlayerResponse>(this.apiUrl);
  }

  getFiltered(filters: PlayerFilters): Observable<PlayerResponse> {
    let params = new HttpParams();
    
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.club) {
      params = params.set('club', filters.club);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }

    return this.http.get<PlayerResponse>(`${this.apiUrl}/search`, { params });
  }

  downloadCSV(filters: PlayerFilters): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.club) {
      params = params.set('club', filters.club);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }

    return this.http.get(`${this.apiUrl}/export`, { 
      params,
      responseType: 'blob'
    });
  }

  create(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  update(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
