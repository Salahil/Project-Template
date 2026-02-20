# Dockerfile Multi-stage para o Backend (A versão robusta e recomendada)

# ---- Estágio 1: Build (O Padeiro do Java) ----
# Ele cria um ambiente temporário com Maven e Java para compilar o projeto.
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Estágio 2: Run (O Garçom do Java) ----
# Agora, pegamos uma imagem leve, só com o Java para rodar.
FROM openjdk:21-jdk-slim
WORKDIR /app

# A mágica: copiamos APENAS o .jar do estágio de build para a imagem final.
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]