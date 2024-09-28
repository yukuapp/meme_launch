# Yuku Ai Avatar Api


## Local Development

For local deployment, you need to modify the parameters about mongodb in env

```
cp env .env
docker build -t yuku_marketplace_api .
docker run -d --name yuku_marketplace_api yuku_marketplace_api
```

## Production Development

```
docker run -d --name yuku_marketplace_api --restart=always -p 5002:5001 -e DATABASE_URL="mysql_url" -e REDIS_URL="redis_url" -e REDIS_PASSWORD=redis_passwd -e REDIS_DB=15 -e PORT=5001 jayz9527/yuku_marketplace_api
```

## Api

See [Swagger](https://stat.yuku.app/swagger)

### Environment
 - Development : https://stat.yuku.app
 - Staging : https://staging-stat.yuku.app
 - Production : https://test-stat.yuku.app
