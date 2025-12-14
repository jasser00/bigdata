# React + TypeScript + Vite with Docker Compose

This project is a full-stack application that uses React for the frontend, FastAPI for the backend, PostgreSQL as the database, Redpanda as the Kafka alternative, and Nginx as a reverse proxy.

## Project Structure

```
big
├── frontend_bigdata
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── public
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── backend_bigdata
│   ├── alembic
│   ├── app
│   ├── .env
│   ├── .gitignore
│   ├── Readme.md
│   ├── __init__.py
│   ├── alembic.ini
│   ├── poetry.lock
│   ├── pyproject.toml
│   └── test.py
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd big
   ```

2. **Set up environment variables**:
   - Create a `.env` file in both `frontend_bigdata` and `backend_bigdata` directories with the necessary environment variables.

3. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)
   - Nginx: [http://localhost](http://localhost)

## Services

- **Frontend**: React application served by Vite.
- **Backend**: FastAPI application with PostgreSQL as the database.
- **PostgreSQL**: Database service for storing application data.
- **Redpanda**: Kafka-compatible streaming platform for handling real-time data.
- **Nginx**: Reverse proxy server for routing requests to the frontend and backend services.

## Dependencies

- React
- FastAPI
- PostgreSQL
- Redpanda
- Nginx

## License

This project is licensed under the MIT License. See the LICENSE file for details.