if [ $(grep NODE_ENV .env | cut -d '=' -f2) = "development" ]; then
  ts-node src/index.ts $1 $2
else
  node dist/index.js
fi