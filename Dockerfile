From node:14-alpine
WORKDIR /app
COPY package.json /app
run npm install
COPY . /app
CMD ["npm","start"]
EXPOSE 3000