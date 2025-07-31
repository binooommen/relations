FROM node:20
WORKDIR /app
RUN apt-get update && apt-get install -y postgresql-client
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x wait-for-postgres.sh
ENTRYPOINT ["./wait-for-postgres.sh", "db"]
CMD ["node", "index.js"]
