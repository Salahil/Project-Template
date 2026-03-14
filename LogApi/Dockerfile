# Usa o Java 21 (igual ao teu JRE System Library)
FROM eclipse-temurin:21-jdk-alpine

# Define a pasta de trabalho dentro do contentor
WORKDIR /app

# Copia todo o código do teu backend para dentro do contentor
COPY . .

# Executa o Maven para compilar o projeto (ignorando os testes para ser mais rápido)
RUN ./mvnw clean package -DskipTests

# Comando para iniciar a tua API Java
CMD ["sh", "-c", "java -jar target/*.jar"]