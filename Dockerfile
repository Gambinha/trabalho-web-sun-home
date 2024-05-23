FROM node:18-alpine As development
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine As production
ARG NODE_ENV=production
ARG NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/prisma ./prisma/
EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod"]