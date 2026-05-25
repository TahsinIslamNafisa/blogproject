# Blog API

A complete RESTful Blog API built with **Express.js**, **MongoDB (Mongoose)**, and **JWT Authentication**.

---

## 📁 Project Structure

```
blog-api/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   └── blogController.js      # CRUD blog logic
│   ├── middlewares/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Blog.js                # Blog schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── blogRoutes.js          # Blog endpoints
│   └── app.js                     # App entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd blog-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 4. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔐 Authentication

All blog routes are **protected**. You must include a valid JWT token in the request header:

```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint              | Description         | Access  |
|--------|-----------------------|---------------------|---------|
| POST   | `/api/auth/register`  | Register a new user | Public  |
| POST   | `/api/auth/login`     | Login user          | Public  |

### Blog Routes

| Method | Endpoint          | Description              | Access            |
|--------|-------------------|--------------------------|-------------------|
| POST   | `/api/blogs`      | Create a new blog        | Private           |
| GET    | `/api/blogs`      | Get all blogs (paginated)| Private           |
| GET    | `/api/blogs/:id`  | Get a single blog        | Private           |
| PUT    | `/api/blogs/:id`  | Update a blog            | Private (Author)  |
| DELETE | `/api/blogs/:id`  | Delete a blog            | Private (Author)  |

---

## 📋 Request & Response Examples

### Register
**POST** `/api/auth/register`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "<jwt_token>"
  }
}
```

### Login
**POST** `/api/auth/login`
```json
// Request Body
{
  "email": "john@example.com",
  "password": "password123"
}

// Response 200
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "<jwt_token>"
  }
}
```

### Create Blog
**POST** `/api/blogs`  
Header: `Authorization: Bearer <token>`
```json
// Request Body
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It needs at least 20 chars.",
  "tags": ["express", "nodejs"]
}

// Response 201
{
  "success": true,
  "message": "Blog created successfully.",
  "data": { ... }
}
```

### Get All Blogs
**GET** `/api/blogs?page=1&limit=10`  
Header: `Authorization: Bearer <token>`

### Update Blog
**PUT** `/api/blogs/:id`  
Header: `Authorization: Bearer <token>`
```json
{
  "title": "Updated Title",
  "content": "Updated content that is long enough."
}
```

### Delete Blog
**DELETE** `/api/blogs/:id`  
Header: `Authorization: Bearer <token>`

---

## 🛡️ Security Features

- Passwords hashed with **bcryptjs**
- JWT-based stateless authentication
- Only blog **authors** can edit or delete their own blogs
- Input validation with Mongoose schema validators

---

## 🧰 Tech Stack

- **Node.js** + **Express.js** — Server framework
- **MongoDB** + **Mongoose** — Database & ODM
- **JSON Web Token (JWT)** — Authentication
- **bcryptjs** — Password hashing
- **dotenv** — Environment variable management
