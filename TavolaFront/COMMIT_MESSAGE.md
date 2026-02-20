# Título do Commit

```
feat: melhorias de UX mobile e ajustes de layout em reservas e navegação
```

# Descrição do Commit

```
feat: melhorias de UX mobile e ajustes de layout em reservas e navegação

## 🎨 Melhorias Visuais e Layout

### Calendário de Reservas
- Restaurado display de nomes de clientes e informações de reservas nos quadrados dos dias (desktop)
- Adicionado scroll interno nos dias com múltiplas reservas
- Indicador amarelo de reservas agora visível apenas no mobile
- Cards de reserva mais compactos na lista de detalhes
- Implementado comportamento master-detail unificado para desktop e mobile

### Banner Home (Mobile)
- Implementado efeito "full bleed" para banner amarelo ocupar toda a largura
- Ajustado espaçamento entre pizza e texto "Descubra e reserve..."
- Pizza maior (240px) e mais próxima do texto
- Texto com sombra mais forte para melhor legibilidade
- Banner com border-radius apenas na parte inferior

### Agendamento de Reservas
- Padding-top aumentado para 110px no mobile (revela breadcrumb e título)
- Substituído nz-drawer por MatDialog para melhor controle de estilos
- Dialog fullscreen sem backdrop cinza
- Mixin SCSS compartilhado entre desktop e mobile para consistência visual
- Calendário menor com scroll no mobile
- Navegação, horários e seleção de pessoas estilizados igual ao desktop

### Drawers e Modais
- Drawer de opções dietéticas ocupa 60% da tela no mobile
- Drawer principal do layout ocupa 75% da tela no mobile
- Botões e fontes reduzidos no drawer principal
- Ícone de configurações com melhor visibilidade e sombra
- Z-index ajustado para drawer aparecer acima do menubar

## 🔍 Sistema de Busca Sticky

### Funcionalidades
- Busca sticky aparece no header quando scroll passa do banner na home
- Ícone de busca sempre visível no mobile (exceto quando expandido)
- Busca pode ser aberta de qualquer página
- Redirecionamento para home apenas ao executar a busca (Enter)
- IntersectionObserver configurado para detectar scroll no router-container
- Busca não aparece em sub-rotas de /home (ex: /home/agendamento)

### Correções
- Removido flickering da barra de busca
- Transição suave entre estados sticky/non-sticky
- Sincronização correta de FormControls entre home e sticky search

## 📱 Responsividade e Mobile

### Layout Principal
- Padding condicional: 0 na home, 20px em outras páginas (mobile)
- Classe dinâmica .home-padding aplicada apenas na home
- Header sticky na home (fixed), sticky em outras páginas
- Menu de notificações herda estilo do menu de perfil
- Removidas tabs "Pendentes" e "Lidas" do menu de notificações
- Menus dropdown posicionados corretamente abaixo dos ícones no mobile

### Home
- Cards de restaurantes com largura fixa (260px desktop, 280px mobile)
- Scroll horizontal funcional com setas de navegação
- Banner não é empurrado para direita por restaurantes
- Seção de restaurantes com overflow-x: hidden

## 🐛 Correções de Bugs

- Conteúdo do agendamento não fica mais escondido atrás do header
- Breadcrumb e título do restaurante visíveis no mobile
- Ícone de busca funciona corretamente em todas as páginas
- Sticky search não aparece em rotas incorretas
- Scroll para topo ao entrar na tela de agendamento
- Posicionamento correto de menus dropdown no mobile

## 🔧 Melhorias Técnicas

- SCSS Mixin para compartilhar estilos de card de reserva
- IntersectionObserver para detecção de scroll preciso
- Lógica de roteamento aprimorada para controle de sticky search
- Cleanup adequado de observers e listeners no ngOnDestroy
- Propriedade isHomePage pública para uso no template

## 📝 Arquivos Modificados

### Componentes
- calendario-reservas.component.ts/html/scss
- agendamento-reservas-restaurante.component.ts/html/scss
- layout-principal.component.ts/html/scss
- home.component.ts/html/scss
- reserva-dialog.component.ts/html/scss (novo)

### Serviços
- sticky-search.service.ts

### Estilos
- Ajustes em múltiplos arquivos SCSS para responsividade
- Mixins SCSS para reutilização de estilos
- Media queries otimizadas para mobile

---

**Breaking Changes:** Nenhum

**Migration Guide:** Nenhuma migração necessária


