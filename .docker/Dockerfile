FROM node:14

RUN mkdir -p /app
WORKDIR /app

COPY .npmrc .
COPY package.json .
COPY package-lock.json .
COPY entrypoint.sh .

RUN chmod +x /app/entrypoint.sh

RUN npm install --production

COPY ./dist .

USER node
EXPOSE 8787
EXPOSE 8080
ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "" ]