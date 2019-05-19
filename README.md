# okta-painless-nodejs-authentication
## Install dependencies
```
  npm install
```

## Create .env file in the root of the project
```
JWT_PRIVATE_KEY=secret
```

## Start server
```
npm start
```

## Use curl or postman to execute these requests:
```
curl -X POST \
  http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{
	"email": "third.user@gmail.com",
	"password": "password"
}'
```

```
curl -X POST \
  http://localhost:3000/jwt-login \
  -H 'Content-Type: application/json' \
  -d '{
	"email": "first.user@gmail.com",
	"password": "password"
}'
```

```
curl -X GET \
  http://localhost:3000/users \
  -H 'Access-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU1ODI4NTA0MX0.7jzfXrVM35A24-4VPLOli8kuzTxFZuPah-IlX2_akCE'
```
