FROM node:latest AS build

WORKDIR /frontend

COPY package.json ./ 
COPY package-lock.json ./ 
RUN npm install 
COPY . . 
RUN npm run build 

FROM nginx:alpine 
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /frontend/dist/frontend /usr/share/nginx/html