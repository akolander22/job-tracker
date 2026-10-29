FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite needs to know the backend URL at build time
ARG VITE_API_URL=http://localhost:8001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Production stage: just nginx serving the static files ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80