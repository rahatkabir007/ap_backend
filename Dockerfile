FROM node:16.15-alpine3.15 As development

WORKDIR /usr/src/app-server

COPY package*.json ./

RUN npm install --ignore-scripts --only=development

COPY . .

RUN npm run build

FROM node:16.15-alpine3.15 As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app-server

COPY package*.json ./

RUN npm install --ignore-scripts --only=production

COPY . .

COPY --from=development /usr/src/app-server/dist ./dist

#api port
EXPOSE 8000

# #socket port
# EXPOSE 3003

CMD ["node", "dist/main"]
