FROM node

# Create app directory
WORKDIR /app

COPY .. .

RUN npm install

COPY . .

EXPOSE 8001

# Run the server
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

CMD npm run start-${NODE_ENV}