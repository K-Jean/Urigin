FROM node:8 as build

COPY package.json package-lock.json tsconfig.json /app/
WORKDIR /app

RUN npm install

FROM node:8

ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g typescript
COPY --from=build /app .
COPY src /app/src

RUN tsc
RUN rm -r src

EXPOSE 3000
CMD ["node", "dist/index.js"]
