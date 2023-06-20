ARG NODE_IMAGE=node:18

FROM ${NODE_IMAGE} as frontend_builder

WORKDIR /code

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

RUN npm run build

FROM nginx:alpine

COPY --from=frontend_builder /code/dist/ /usr/share/nginx/html
ADD docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 80
