FROM node:12

RUN npm install -g npm ts-node typescript

WORKDIR /app

COPY package*.json ./

RUN npm install 

ENV PORT=3000

EXPOSE 3000

COPY . .

CMD ["npm","run","dev"]