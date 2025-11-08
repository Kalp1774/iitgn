# use Debian-based node so esbuild native binary works
FROM node:20-bullseye

WORKDIR /usr/src/app

# copy package manifests and install dependencies (npm install works without lockfile)
COPY package.json package-lock.json* ./
RUN npm install

# copy app source
COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]
