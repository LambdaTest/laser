FROM node:14 as builder

# setting up working dir
WORKDIR /app

# copying only package files (to optimise for build peformance)
COPY ./package.json /app/package.json
# COPY ./package-lock.json /app/package-lock.json

# installing deps
RUN npm i

# copy source code to the docker image
COPY . .

# generating production build
RUN npm run build

# using optimised image for deployment
FROM nginx:alpine

# copying nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# copying built source from builder container
COPY --from=builder /app/out /usr/share/nginx/html
