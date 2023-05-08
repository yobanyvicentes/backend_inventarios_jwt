FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8075

# en lugar de index.js debes colocar el nombre que le hayas asignado al archivo principal, si no es index, suele llamarse app
CMD [ "node", "index.js" ]
