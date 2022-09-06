FROM node:18-bullseye-slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
