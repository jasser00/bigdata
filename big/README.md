# Frontend and Backend Project

This project is a full-stack application that utilizes React for the frontend and FastAPI for the backend. It includes a PostgreSQL database for data storage, Redpanda (Kafka) for message brokering, and Nginx as a reverse proxy to manage requests between the frontend and backend services.

## Project Structure

The project is organized into two main directories: `frontend_bigdata` and `backend_bigdata`.

### Frontend (`frontend_bigdata`)

- **src/**: Contains the source code for the React application.
  - **api/**: Contains API-related code, including prediction requests.
  - **assets/**: Contains static assets like SVG files.
  - **components/**: Contains reusable React components.
  - **pages/**: Contains individual page components for routing.
  - **App.tsx**: The main application component.
  - **index.tsx**: The entry point for the React application.
  - **styles.css**: Contains global styles for the application.
- **public/**: Contains public assets like the Vite logo.
- **.env**: Environment variables for the frontend application.
- **README.md**: Documentation for the frontend project.

### Backend (`backend_bigdata`)

- **app/**: Contains the main application logic.
  - **api/**: Contains API endpoints and logic for predictions.
  - **db/**: Contains database models, CRUD operations, and session management.
  - **main.py**: The entry point for the FastAPI application.
- **alembic/**: Contains migration scripts and configuration for database migrations.
- **.env**: Environment variables for the backend application.
- **README.md**: Documentation for the backend project.

## Services

### PostgreSQL
A relational database management system used for storing application data.

### Redpanda (Kafka)
A high-performance streaming platform that acts as a message broker between the frontend and backend services.

### Nginx
A web server that serves as a reverse proxy to route requests to the appropriate service.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd big
   ```

2. **Set up environment variables**:
   - Create a `.env` file in both `frontend_bigdata` and `backend_bigdata` directories with the necessary environment variables.

3. **Run the application**:
   - Use Docker Compose to start all services:
   ```bash
   docker compose up --build
   ```

4. **Access the application**:
   - The frontend will be available at `http://localhost:3000`.
   - The backend API will be available at `http://localhost:8000`.

## Production Deployment (Azure VM)

### Prerequisites
- Azure VM with Docker and Docker Compose installed
- Domain `bigdataproject.tech` pointing to the VM's public IP
- Ports 80 (HTTP) open in Azure Network Security Group

### Deployment Steps

1. **Copy the project to the Azure VM**:
   ```bash
   scp -r ./* user@<VM_PUBLIC_IP>:/home/user/big/
   ```

2. **SSH into the VM**:
   ```bash
   ssh user@<VM_PUBLIC_IP>
   ```

3. **Navigate to the project directory**:
   ```bash
   cd /home/user/big
   ```

4. **Build and start the containers**:
   ```bash
   docker compose up --build -d
   ```

5. **Verify all services are running**:
   ```bash
   docker compose ps
   ```

6. **Access the application**:
   - Open `http://bigdataproject.tech` in your browser
   - API is accessible at `http://bigdataproject.tech/api/`

### Useful Commands

```bash
# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Restart services
docker compose restart

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes data)
docker compose down -v

# Rebuild and restart a specific service
docker compose up --build -d backend
```

### Security Considerations

For production, you should:
1. Change the default PostgreSQL password in `docker-compose.yml`
2. Consider adding HTTPS with Let's Encrypt (use certbot or nginx-proxy)
3. Restrict access to the VM using Azure NSG rules
4. Set up proper backup for the PostgreSQL data volume

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.