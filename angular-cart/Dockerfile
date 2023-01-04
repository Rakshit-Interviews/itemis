#Step 1 (use node 18 lts)
FROM node:18 as node  
WORKDIR /app
COPY . .
RUN npm cache clean --force

RUN npm ci
RUN npm run build --prod

#Step 2
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/angular-cart /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080
