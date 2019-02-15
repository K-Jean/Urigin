FROM node:8 as build

COPY package.json package-lock.json tsconfig.json /app/
WORKDIR /app

RUN npm install

FROM node:8

RUN npm install -g typescript
COPY --from=build /app .
COPY . /app
WORKDIR /app

RUN tsc

EXPOSE 3000
CMD ["node", "dist/index.js"]
