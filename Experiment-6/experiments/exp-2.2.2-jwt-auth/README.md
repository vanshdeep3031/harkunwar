# Experiment 2.2.2 — JWT Authentication for Banking API

**Course Outcomes:** CO3, CO4  
**Tech Stack:** Node.js · Express.js · MongoDB · jsonwebtoken · bcryptjs

---

## Setup

```bash
cd exp-2.2.2-jwt-auth
npm install
# Edit .env — set your MONGO_URI and strong JWT secrets
npm run dev
```

---

## How JWT Works

```
Header.Payload.Signature

Header:    { alg: 'HS256', typ: 'JWT' }
Payload:   { id: 'user_id', email: 'user@bank.com', iat: ..., exp: ... }
Signature: HMACSHA256(base64(header) + '.' + base64(payload), secret)
```

Access tokens expire in **15 minutes**. Refresh tokens last **7 days**.

---

## Testing with curl / Postman

### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Srizan","email":"srizan@bank.com","password":"secure123"}'
```
Expected: `201 Created` with `accountNumber`

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"srizan@bank.com","password":"secure123"}'
```
Expected: `200 OK` with `accessToken` and `refreshToken`

### 3. Check Balance (protected)
```bash
curl http://localhost:3000/api/banking/balance \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Deposit
```bash
curl -X POST http://localhost:3000/api/banking/deposit \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"amount":5000}'
```

### 5. Withdraw
```bash
curl -X POST http://localhost:3000/api/banking/withdraw \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"amount":1000}'
```

### 6. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### 7. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## Postman Testing Summary

| Endpoint | Description | Expected Status |
|---|---|---|
| POST /api/auth/register | Register new user | 201 Created |
| POST /api/auth/login | Login and get tokens | 200 OK |
| GET /api/banking/balance | View balance (protected) | 200 OK |
| POST /api/banking/deposit | Deposit money (protected) | 200 OK |
| POST /api/banking/withdraw | Withdraw money (protected) | 200 OK |
| POST /api/auth/refresh | Get new access token | 200 OK |
| POST /api/auth/logout | Invalidate refresh token | 200 OK |
| GET /api/banking/balance (no token) | No auth header | 401 Unauthorized |
| GET /api/banking/balance (expired) | Expired token | 401 Unauthorized |
| GET /api/banking/balance (tampered) | Invalid signature | 403 Forbidden |

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Port 5000 not working | macOS AirPlay uses 5000 — change PORT=3000 in .env |
| 403 Forbidden in Postman | Set `Content-Type: application/json`; use raw JSON body |
| `next is not a function` | Mongoose v7+ pre-save hooks don't take `next` param — already fixed here |
| No curl response | Server not running — keep `npm run dev` active in a separate terminal |
