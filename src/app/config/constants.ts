import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly API_ENDPOINT: string = 'https://game-point-api.onrender.com';

  // public readonly API_ENDPOINT: string = 'http://localhost:8080';
}
