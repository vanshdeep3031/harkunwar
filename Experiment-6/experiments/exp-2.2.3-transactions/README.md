# Experiment 2.2.3 — Transaction System with Rollback

**Course Outcomes:** CO3, CO4  
**Tech Stack:** Node.js · Express.js · MongoDB (Replica Set) · Mongoose Sessions

---

## ⚠️ Important: Replica Set Required

MongoDB transactions only work on a **Replica Set** (not standalone mongod).

### Option A — Local Replica Set
```bash
# Terminal 1: start mongod with replica set
mongod --replSet rs0

# Terminal 2: initialize the replica set (first time only)
mongosh --eval "rs.initiate()"
```
Update `.env`:
```
MONGO_URI=mongodb://localhost:27017/transactionDB?replicaSet=rs0
```

### Option B — MongoDB Atlas (easiest)
Create a free cluster at https://cloud.mongodb.com. Atlas uses replica sets by default.
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/transactionDB
```

---

## Setup

```bash
cd exp-2.2.3-transactions
npm install
# Configure .env (see above)
npm run dev
```

---

## ACID Properties Demonstrated

| Property | How It's Implemented |
|---|---|
| **Atomicity** | Both debit and credit happen in one session — if either fails, both are rolled back |
| **Consistency** | Balance is checked before debit; `min: 0` enforced at schema level |
| **Isolation** | MongoDB session isolates writes until `commitTransaction()` |
| **Durability** | Committed transactions survive server restarts |

---

## Testing Workflow

### 1. Register Two Users
```bash
# User A
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@bank.com","password":"pass123","initialBalance":5000}'

# User B
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@bank.com","password":"pass123","initialBalance":1000}'
```

### 2. Login as Alice
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@bank.com","password":"pass123"}'
# Save the token
TOKEN="<token from response>"
```

### 3. Check Balance
```bash
curl http://localhost:3000/api/transactions/balance \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Successful Transfer (Alice → Bob)
```bash
curl -X POST http://localhost:3000/api/transactions/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"toAccountNumber":"<Bob_ACC_number>","amount":1000}'
```
Expected: `200 OK` — both balances updated atomically.

### 5. Failed Transfer — Insufficient Balance (triggers rollback)
```bash
curl -X POST http://localhost:3000/api/transactions/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"toAccountNumber":"<Bob_ACC_number>","amount":999999}'
```
Expected: `400 Bad Request` — no balance change, FAILED log created.

### 6. View Transaction History & Audit Logs
```bash
curl http://localhost:3000/api/transactions/history \
  -H "Authorization: Bearer $TOKEN"

curl http://localhost:3000/api/transactions/logs \
  -H "Authorization: Bearer $TOKEN"
```

---

## Expected Outputs

| Scenario | Status | Log Entry |
|---|---|---|
| Sufficient balance transfer | 200 OK | `SUCCESS` |
| Insufficient balance | 400 Bad Request | `FAILED` |
| Server/DB error during transfer | 500 + rollback | `ROLLED_BACK` |
| Balances after failed transfer | Unchanged | — |
