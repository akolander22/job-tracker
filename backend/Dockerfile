FROM node:20-alpine

WORKDIR /app

# Copy deps first — Docker caches this layer until package.json changes
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# The SQLite file will live in /data, which we mount as a volume
ENV DB_PATH=/data/jobs.db
ENV PORT=8001

EXPOSE 8001
CMD ["node", "server.js"]