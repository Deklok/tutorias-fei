# base image
FROM node:12.12.0-alpine

# set working directory
WORKDIR /app

COPY . ./

RUN npm install --silent
RUN npm install react-scripts@3.1.2 -g --silent
