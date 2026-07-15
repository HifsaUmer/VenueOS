FROM node:20-alpine

WORKDIR /app

# Install ts-node for seeding
RUN npm install -g ts-node

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]