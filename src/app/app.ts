import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
   standalone: true, // <-- เพิ่มบรรทัดนี้ เพื่อให้เป็น Standalone Component ที่สมบูรณ์
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'GamePoint-ui';
}
