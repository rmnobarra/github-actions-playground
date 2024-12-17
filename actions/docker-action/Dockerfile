# Usa a imagem base do Alpine Linux
FROM alpine:latest

# Instala ferramentas básicas (opcional)
RUN apk add --no-cache bash curl

# Copia o script de entrada para o container
COPY entrypoint.sh /entrypoint.sh

# Dá permissão de execução ao script
RUN chmod +x /entrypoint.sh

# Define o script como ponto de entrada
ENTRYPOINT ["/entrypoint.sh"]
