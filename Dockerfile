FROM node:18 as build-stage
WORKDIR /app/front
COPY ./front/package*.json ./
RUN npm install
RUN npm install -g cross-env
COPY ./front . 
RUN cross-env NODE_OPTIONS=--max-old-space-size=4096 npm run build

FROM node:18 as production-stage
WORKDIR /app/back/
COPY ./back/package*.json ./
RUN npm install
RUN npm install -g pm2
COPY ./back .
RUN npm run build
COPY --from=build-stage /app/front/dist ./dist/public
RUN mkdir -p ./uploads
EXPOSE 3000 443

CMD [ "pm2-runtime", "start", "./dist/index.js" ]