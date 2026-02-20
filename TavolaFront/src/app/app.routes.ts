import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/acesso/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/acesso/signup/signup.component').then(m => m.SignUpComponent)
  },
  {
    path: 'verificacao-email',
    loadComponent: () => import('./pages/acesso/verificacao-email/verificacao-email.component').then(m => m.VerificacaoEmailComponent)
  },
  {
    path: 'confirmar-codigo/:id',
    loadComponent: () => import('./pages/acesso/confirmar-codigo/confirmar-codigo.component').then(m => m.ConfirmarCodigoComponent)
  },
  {
    path: 'redefinir-senha/:token',
    loadComponent: () => import('./pages/acesso/redefinir-senha/redefinir-senha.component').then(m => m.RedefinirSenhaComponent)
  },
  { 
    path: 'cardapio-publico/:idRestaurante', // :idRestaurante será o parâmetro
    loadComponent: () => import('./pages/cardapio-publico/cardapio-publico.component').then(m => m.CardapioPublicoComponent) 
  },
  {
    path: '',
    loadComponent: () => import('./pages/layout-principal/layout-principal.component').then(m => m.LayoutPrincipalComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        children: [
          { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [roleGuard], data: { roles: ['CLIENTE'] } },
          { path: 'agendamento-reservas-restaurante/:id', loadComponent: () => import('./pages/home/agendamento-reservas-restaurante/agendamento-reservas-restaurante.component').then(m => m.AgendamentoReservasRestauranteComponent) }
        ]
      },
      { path: 'meu-restaurante', loadComponent: () => import('./pages/meu-restaurante/meu-restaurante.component').then(m => m.MeuRestauranteComponent), canActivate: [roleGuard], data: { roles: ['RESTAURANTE'] } },
      { path: 'cadastro-cardapio', loadComponent: () => import('./pages/cadastro-cardapio/cadastro-cardapio.component').then(m => m.CadastroCardapioComponent), canActivate: [roleGuard], data: { roles: ['RESTAURANTE'] } },
      { path: 'reserva', loadComponent: () => import('./pages/reservas/reservas.component').then(m => m.ReservasComponent), canActivate: [roleGuard], data: { roles: ['RESTAURANTE'] } },
      { path: 'gerenciar-equipe', loadComponent: () => import('./pages/gerenciar-equipe/gerenciar-equipe.component').then(m => m.GerenciarEquipeComponent), canActivate: [roleGuard], data: { roles: ['RESTAURANTE'] } },
      { path: 'painel-garcom', loadComponent: () => import('./pages/painel-garcom/painel-garcom.component').then(m => m.PainelGarcomComponent), canActivate: [roleGuard], data: { roles: ['FUNCIONARIO'] } },
      { path: 'historico', loadComponent: () => import('./pages/historico-reservas/historico-reservas.component').then(m => m.HistoricoReservasComponent), canActivate: [roleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'favoritos', loadComponent: () => import('./pages/favoritos/favoritos.component').then(m => m.FavoritosComponent), canActivate: [roleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'configuracoes', loadComponent: () => import('./pages/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent), canActivate: [AuthGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
