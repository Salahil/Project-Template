# Etapa 1: Construir o projeto Angular usando o Node.js 22 (Atualizado!)
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Criar um servidor web (Nginx)
FROM nginx:alpine
# Lembra-te de ajustar "nome-do-teu-projeto" se necessário
COPY --from=build /app/dist/nome-do-teu-projeto /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]