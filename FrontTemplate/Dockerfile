# Etapa 1: Construir o projeto Angular usando o Node.js
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Criar um servidor web (Nginx) leve para mostrar as tuas páginas
FROM nginx:alpine
# Copia o código compilado da Etapa 1 para a pasta pública do Nginx
# ATENÇÃO: Substitui "nome-do-teu-projeto" pelo nome correto que aparece dentro da pasta /dist após compilar
COPY --from=build /app/dist/nome-do-teu-projeto /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]