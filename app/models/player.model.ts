export interface Player {
  id?: number;
  name: string;
  age: number;
  nationality: string;
  club: string;
  position: string;
  overall: number;
  
  // Skills principales
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

export interface PlayerResponse {
  success: boolean;
  count: number;
  data: Player[];
}
