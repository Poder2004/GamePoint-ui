import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/api.model';
import { UserService } from '../../services/user.service';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-navadmin',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './navadmin.html',
  styleUrl: './navadmin.scss',
})
export class Navadmin {
  public isUserLoggedIn: boolean = false;
  public currentUser: User | null = null;
  public userImageUrl: string | null = null;
  public isProfileOpen = false;

  navLinks = [
    { name: 'หน้าหลัก', path: '/Mainadmin' },
    { name: 'เพิ่มรายการใหม่', path: '/addgame' },
    { name: 'โค้ดส่วนลด', path: '/discounts' },
    { name: 'ประวัติการทำธุรกรรม', path: '/history' },
  ];

  activeLink = this.navLinks[0].name;

  constructor(
    private constants: Constants,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    if (this.isUserLoggedIn) {
      // 🔑 แก้ไข: อ่านจาก 'userData'
      const userJson = localStorage.getItem('userData');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        this.buildUserImageUrl();
      }
    }
  }

  setActiveLink(linkName: string): void {
    this.activeLink = linkName;
  }

  toggleProfileSidebar(): void {
    if (!this.isProfileOpen) {
      this.refreshUserProfileData();
    }
    this.isProfileOpen = !this.isProfileOpen;
  }

  private refreshUserProfileData(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response && response.user) {
          this.currentUser = response.user;
          // 🔑 แก้ไข: อัปเดตที่ 'userData'
          localStorage.setItem('userData', JSON.stringify(this.currentUser));
          this.buildUserImageUrl();
        }
      },
      error: (err) => {
        console.error('Failed to refresh user profile:', err);
        if (err.status === 401) {
          this.logout();
        }
      },
    });
  }

  private buildUserImageUrl(): void {
    if (this.currentUser && this.currentUser.image_profile) {
      this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.image_profile}`;
    } else {
      // สามารถใส่ URL รูป default ได้ที่นี่
      this.userImageUrl = null;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    // 🔑 แก้ไข: ลบ 'userData'
    localStorage.removeItem('userData');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
