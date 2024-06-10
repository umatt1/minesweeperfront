FROM nginx:bookworm
EXPOSE 80
# Frontend with production files
COPY  ./dist /usr/share/nginx/html