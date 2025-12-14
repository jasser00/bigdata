# Backend Big Data Project

This project is a full-stack application that utilizes a React frontend, a FastAPI backend, and integrates with PostgreSQL and Redpanda (Kafka) for data handling and messaging. The application is containerized using Docker and orchestrated with Docker Compose.

## Project Structure

- **frontend_bigdata**: Contains the React frontend application.
  - **src**: Source code for the frontend.
  - **public**: Public assets for the frontend.
  - **.env**: Environment variables for the frontend.
  - **README.md**: Documentation for the frontend project.

- **backend_bigdata**: Contains the FastAPI backend application.
  - **alembic**: Database migration scripts and configurations.
  - **app**: Main application logic, including API endpoints and database models.
  - **.env**: Environment variables for the backend.
  - **README.md**: Documentation for the backend project.

## Services

- **PostgreSQL**: Used as the primary database for storing application data.
- **Redpanda (Kafka)**: Acts as a messaging layer between the frontend and backend for handling asynchronous communication.
- **Nginx**: Serves as a reverse proxy to route requests to the appropriate services.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Set up environment variables**:
   - Create a `.env` file in both `frontend_bigdata` and `backend_bigdata` directories with the necessary configurations.

3. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - Nginx: `http://localhost`

## Dependencies

- **Frontend**: React, Vite, TypeScript
- **Backend**: FastAPI, SQLAlchemy, Alembic, Pydantic
- **Database**: PostgreSQL
- **Messaging**: Redpanda (Kafka)
- **Web Server**: Nginx

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.