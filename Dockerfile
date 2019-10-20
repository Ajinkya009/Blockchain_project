FROM node:latest
RUN mkdir -p /usr/src/matic
WORKDIR /usr/src/matic
COPY package.json /usr/src/matic/
RUN npm install
COPY . /usr/src/matic
EXPOSE 3000
CMD ["npm","start"]