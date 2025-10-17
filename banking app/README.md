# Banking App MVP

A modern banking backend API built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- User authentication with JWT
- Account management
- Secure money transfers with idempotency
- Transaction history
- Atomic operations with ledger system

## Setup

1. Install dependencies:
   ```bash
   pip install -e .
   ```

2. Set up environment variables in `.env` (see .env.example)

3. Run migrations:
   ```bash
   alembic upgrade head
   ```

4. Run the app:
   ```bash
   uvicorn src.banking_app.main:app --reload
   ```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API docs.

## Testing

Run tests with:
```bash
pytest
```

## Deployment

Use Docker:
```bash
docker-compose up --build
```