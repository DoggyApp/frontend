FROM node:latest AS build

WORKDIR /frontend

COPY package.json . 
COPY package-lock.json . 
RUN npm install 

COPY . . 
RUN npm run build 

# Final image
FROM nginx:alpine

# i only needed this for local testing, i use an ingress controller on my aws deployment 
# COPY nginx/nginx.conf /etc/nginx/nginx.conf 

# Copy built Angular app to Nginx's default html location
COPY --from=build /frontend/dist/frontend /usr/share/nginx/html

# Optional: keep for dynamic config injection
RUN mkdir -p /usr/share/nginx/html/assets
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run the script which injects config and starts Nginx
ENTRYPOINT ["/entrypoint.sh"]
