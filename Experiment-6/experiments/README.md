# Node.js Backend Experiments — 2.2.1, 2.2.2, 2.2.3

Three complete Node.js + Express.js + MongoDB experiments.

---

## Quick Start (any experiment)

```bash
cd exp-2.2.X-<name>
npm install
# edit .env as needed
npm run dev
```

---

## Experiment Overview

| Experiment | Topic | Key Concepts |
|---|---|---|
| **2.2.1** `exp-2.2.1-middleware` | Middleware Implementation | Custom logging, auth, error handling, middleware chaining |
| **2.2.2** `exp-2.2.2-jwt-auth` | JWT Authentication for Banking API | bcrypt, JWT access/refresh tokens, protected routes |
| **2.2.3** `exp-2.2.3-transactions` | Transaction System with Rollback | MongoDB sessions, ACID properties, atomicity, audit logs |

---

## Common Requirements

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI
- Postman or curl for testing

> **Experiment 2.2.3 only:** MongoDB must be running as a **Replica Set** for transactions to work. See its README for setup steps.

---

## Course Outcomes

- **CO3:** RESTful APIs + MongoDB/MySQL integration with Node.js & Express.js
- **CO4:** Debugging, testing, and optimizing full-stack applications
