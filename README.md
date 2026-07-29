# How to install and run this program

### Set up the environment

#### Create a `.env` file based on `.env.example`.


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

#### - Jest


# How to run test

### Run the following command

```bash
npm run test
```

# Bonus tasks

### 1.Performance Optimization

ทำระบบ Caching Data เพื่อให้ลดการขอข้อมูลจากดาต้าเบสโดยตรง ให้ return ข้อมูลที่เคยขอ หรือเก็บไว้ใน cache ไปแสดงผล สมมุติ เช่น เก็บข้อมูลไว้ใน Redis เมื่อมี request มา และหากผู้ใช้คนอื่นทำการ request แบบเดียวกันมา ให้นำข้อมูลจาก Redis return กลับไป

### 2. Concurrency Control

ทำระบบ Pessimistic Locking เพื่อล็อคที่นั่งนั่นเมื่อมี request เข้ามาจำนวนมาก โดยคนแรกที่ขอเข้ามาจะล็อคเอาไว้ และป้องกัน request อื่นๆที่เข้ามาเพิ่มเติม
