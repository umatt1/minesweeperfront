FROM nginx:latest
EXPOSE 80
# Frontend with production files
COPY  ./dist /usr/share/nginx/html