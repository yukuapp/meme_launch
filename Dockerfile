FROM --platform=linux/amd64 node:18.14-alpine

RUN mkdir -p /app
ADD . /app/

WORKDIR /app
RUN npm install
RUN npx prisma generate
EXPOSE 5001
CMD ["node", "app.js"]