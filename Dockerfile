FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY server.js roasts.js ./
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
