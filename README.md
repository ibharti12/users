# User Management API (Node.js + Express + Sequelize)

This is a backend API for user authentication and profile management built with Node.js, Express, and Sequelize ORM.

---

## 🚀 Installation Steps

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/ibharti12/users.git
cd users

PORT=5000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret


### 2. Install Dependencies
npm install

### 3. Create the Database
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npm start


