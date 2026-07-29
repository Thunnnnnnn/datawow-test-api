# How to install and run this program

### Set up the environment
```text
Create a `.env` file based on `.env.example`.
```

### Start Services
```bash
docker compose up -d
```

### Route

```text
http://localhost:8080
```


### Stop Services

```bash
docker compose down
```

# System Architecture Diagram

```text
                    ┌───────────────┐
                    │   Frontend    │
                    │    Nextjs     │
                    └───────┬───────┘
                            │ HTTP
                            ▼
                    ┌───────────────┐
                    │      API      │
                    │     Nestjs    │
                    │   Framework   │
                    └───────┬───────┘
                            │
                            │                   
                            ▼                  
                     ┌─────────────┐   
                     │  Database   │  
                     │ PostgresSQL │   
                     └─────────────┘   
                                            
```

# Library List

#### - NestJS

#### - PrismaORM

#### - PostqresSQL

#### - Class Validator

#### - bcrypt
