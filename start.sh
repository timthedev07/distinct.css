if [ $(grep NODE_ENV .env | cut -d '=' -f2) = "development" ]; then
  ts-node src/index.ts
else
  node dist/index.js
fi