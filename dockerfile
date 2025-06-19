# Usamos una imagen ligera de NGINX para servir archivos estáticos
FROM nginx:alpine

# Copiamos la carpeta dist ya generada localmente al contenedor
COPY dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
