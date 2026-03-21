import { Component, type OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { AccessService } from '../../core/services/access.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './layout-principal.component.html',
  styleUrls: ['./layout-principal.component.scss']
})
export class LayoutPrincipalComponent implements OnInit {
  sidebarAberta = true;

  private router = inject(Router);
  private auth = inject(AuthService);
  private accessService = inject(AccessService);

  ngOnInit(): void {}

  get userName(): string {
    return this.auth.perfil?.nome || 'Usuário';
  }

  toggleSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }

  logout() {
    this.accessService.postAuthLogout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.auth.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }
}
