import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- สิ่งที่ต้อง Import เพิ่ม ---
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../model/api.model'; // Import model มาใช้

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  public hidePassword = true;
  public loginForm: FormGroup; // 1. สร้างตัวแปรสำหรับฟอร์ม
  public loginError: string | null = null; // 2. สร้างตัวแปรสำหรับเก็บ Error Message

  constructor(
    private fb: FormBuilder, // 3. Inject FormBuilder
    private authService: AuthService, // 4. Inject AuthService
    private router: Router // 5. Inject Router สำหรับเปลี่ยนหน้า
  ) {
    // 6. สร้างโครงสร้างของฟอร์มพร้อม validation
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // field 'username' ต้องไม่เป็นค่าว่าง
      password: ['', [Validators.required]], // field 'password' ต้องไม่เป็นค่าว่าง
    });
  }

  // 7. สร้างฟังก์ชันสำหรับ submit ฟอร์ม
  onSubmit(): void {
    this.loginError = null; // เคลียร์ error message เก่า
    if (this.loginForm.invalid) {
      return; // ถ้าฟอร์มไม่สมบูรณ์ ไม่ต้องทำอะไรต่อ
    }

    const credentials: UserLogin = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('authToken', response.token);

        // ⭐️ แก้ไข key จาก 'currentUser' ให้เป็น 'userData'
        // localStorage.setItem('currentUser', JSON.stringify(response.user)); // <-- บรรทัดเดิมที่ผิด
        localStorage.setItem('userData', JSON.stringify(response.user)); // <-- บรรทัดที่ถูกต้อง 🔑

        if (response.user.role === 'admin') {
          this.router.navigate(['/Mainadmin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      // ...
    });
  }
}
