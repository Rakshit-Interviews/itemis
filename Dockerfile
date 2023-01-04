#For Reverse Proxy
#Step 1
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
