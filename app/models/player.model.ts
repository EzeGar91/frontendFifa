export interface Player {
  id?: number;
  long_name: string;
  age: number;
  nationality_name: string;
  club_name: string;
  player_positions: string;
  overall: number;
  potential?: number;
  value_eur?: number;
  wage_eur?: number;
  height_cm?: number;
  weight_kg?: number;
  preferred_foot?: string;
  work_rate?: string;
}

export interface PlayerResponse {
  success: boolean;
  count: number;
  data: Player[];
}
