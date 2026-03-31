# Multi-stage build: build with Node, serve with nginx
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
# Use npm install inside the container — package-lock.json may be missing on host
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
# Remove default nginx content and copy built app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
