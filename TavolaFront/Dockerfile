# Dockerfile Otimizado (sem build na nuvem)

# Etapa 1: Apenas o servidor Nginx
FROM nginx:stable-alpine

# Limpa a pasta padrão para não ter lixo
RUN rm -rf /usr/share/nginx/html/*

# Copia o conteúdo da nossa pasta 'dist' LOCAL para dentro do container
# Essa pasta foi criada pelo 'ng build' que você rodou na sua máquina
COPY ./dist/login-page/browser/ /usr/share/nginx/html/

# Ajusta permissões
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80