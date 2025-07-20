# Plaid Quickstart Application

This is a Plaid quickstart application that demonstrates how to integrate with Plaid's API. It includes a React frontend and a Python Flask backend.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (for containerized setup)
- [Node.js](https://nodejs.org/) (v14 or higher) and npm (for local frontend development)
- [Python](https://www.python.org/) (3.7 or higher) and pip (for local backend development)
- [Plaid Account](https://dashboard.plaid.com/signup) with API credentials

## Environment Setup

1. **Get your Plaid API credentials** from the [Plaid Dashboard](https://dashboard.plaid.com/team/api)

2. **Create a `.env` file** in the root directory with your Plaid credentials:
   ```bash
   PLAID_CLIENT_ID=your_client_id_here
   PLAID_SECRET=your_secret_here
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=transactions
   PLAID_COUNTRY_CODES=US
   PLAID_REDIRECT_URI=http://localhost:3000/
   ```

## Running the Application

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker Compose, which will start both the frontend and backend services.

#### Quick Start with Docker
```bash
# Start the application (uses Python backend by default)
make up

# View logs
make logs

# Stop the application
make stop
```

#### Manual Docker Commands
```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

### Option 2: Local Development

#### Backend (Python Flask)

1. **Navigate to the Python directory**:
   ```bash
   cd python
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Create virtual environment (if not already created)
   python -m venv venv
   
   # Activate virtual environment
   source venv/bin/activate  # On macOS/Linux
   # or
   .\venv\Scripts\activate   # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**:
   ```bash
   # Using the start script
   ./start.sh
   
   # Or directly with Python
   python server.py
   # or
   python3 server.py
   ```

The backend will run on http://localhost:8000

#### Frontend (React)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## Available Backend Languages

The Docker setup supports multiple backend languages. You can switch between them by modifying the `language` variable in the Makefile:

- `python` (default)
- `node`
- `go`
- `java`
- `ruby`

To use a different backend language:
```bash
# Edit the Makefile and change the language variable
language := node  # or go, java, ruby

# Then run
make up
```

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/info` - Get current item and access token info
- `POST /api/create_link_token` - Create a Link token for Plaid Link
- `POST /api/set_access_token` - Exchange public token for access token
- `GET /api/auth` - Get account and routing numbers
- `GET /api/transactions` - Get transaction data
- `GET /api/identity` - Get account holder information
- `GET /api/balance` - Get account balances
- `GET /api/accounts` - Get account information
- `GET /api/assets` - Get asset report data
- `GET /api/holdings` - Get investment holdings
- `GET /api/investments_transactions` - Get investment transactions
- `GET /api/transfer_authorize` - Authorize a transfer
- `GET /api/transfer_create` - Create a transfer
- `GET /api/statements` - Get account statements
- `GET /api/signal_evaluate` - Evaluate Signal
- `GET /api/payment` - Get payment information
- `GET /api/item` - Get item information
- `GET /api/cra/get_base_report` - Get CRA base report
- `GET /api/cra/get_income_insights` - Get CRA income insights
- `GET /api/cra/get_partner_insights` - Get CRA partner insights

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 3000 or 8000 are already in use, stop the conflicting services or modify the ports in `docker-compose.yml`

2. **Environment variables**: Make sure your `.env` file is properly configured with valid Plaid credentials

3. **Virtual environment**: Ensure you're in the correct virtual environment when running the Python backend locally

4. **Dependencies**: If you encounter dependency issues, try:
   ```bash
   # For frontend
   rm -rf node_modules package-lock.json && npm install
   
   # For backend
   pip install --upgrade -r requirements.txt
   ```

### Docker Issues

- **Clean rebuild**: If you encounter Docker issues, try a clean rebuild:
  ```bash
  docker-compose down
  docker system prune -f
  docker-compose up --build
  ```

- **View logs**: Use `docker-compose logs -f` to see real-time logs from all services

## Development

### Project Structure

```
quickstart/
├── frontend/          # React frontend application
├── python/           # Python Flask backend
├── docker-compose.yml # Docker configuration
├── Makefile          # Build and run commands
└── .env              # Environment variables (create this)
```

### Adding New Features

1. **Backend**: Add new routes to `python/server.py`
2. **Frontend**: Add new components in `frontend/src/Components/`
3. **Environment**: Add new environment variables to `.env` and update the Docker configuration

## Support

For more information about Plaid's API, visit:
- [Plaid Documentation](https://plaid.com/docs/)
- [Plaid Dashboard](https://dashboard.plaid.com/)
- [Plaid Support](https://support.plaid.com/)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 