# Art Nest Setup Instructions

## Introduction

Art Nest is a web application built with Next.js, designed to manage and display artwork, exhibitions, and user data. This app was contracted for by [Tech Returners](https://www.techreturners.com/) who retain all copyright to the code. This guide will walk you through the steps to set up the project on your local machine.

I have yet to sucessfuly deploy this project, but am working out the kinks and hope to soon with vercel.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** (Version as specified by Next.js, check their docs) You can download it from [nodejs.org](https://nodejs.org/).
- **npm** (Usually comes with Node.js) or **Yarn:** (Install via `npm install -g yarn`)
- **Git:** (For cloning the repository) You can download it from [git-scm.com](https://git-scm.com/).
- **PostgreSQL:** (Database) You can download it from [postgresql.org](https://www.postgresql.org/) or use a cloud provider.

## Installation Steps

1.  **Clone the Repository:**

    Open your terminal and navigate to the directory where you want to store the project. Then, clone the repository:

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd art-nest
    ```

2.  **Install Dependencies:**

    Install the required Node.js packages using npm or yarn. The `package.json` you provided lists all the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up the Database:**

    - **Start PostgreSQL:** Ensure your PostgreSQL server is running.
    - **Create a Database:** Create a new database for Art Nest (e.g., `artnestdb`). You can use a tool like `psql` or a GUI like pgAdmin.
    - **Configure Environment Variables:**

      - Create a `.env.local` file in the project's root directory.
      - Add the following environment variables, replacing the values with your actual database credentials:

      ```
      POSTGRES_USER=<your_username>
      POSTGRES_PASSWORD=<your_password>
      POSTGRES_DB=artnestdb
      POSTGRES_HOST=localhost # Or your host if it's not local
      POSTGRES_PORT=5432 # Or your port if it's not the default
      DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
      JWT_SECRET=<your_jwt_secret> # A secret key for JWT (e.g., a long random string)
      ```

      - **Important:** The `JWT_SECRET` should be a long, random, and secure string. This is used to sign JSON Web Tokens. Do not expose it.

4.  **Run Prisma Migrations:**

    Prisma is used as the ORM (Object-Relational Mapper). Run the following commands to set up your database schema:

    ```bash
    npx prisma migrate dev --name init # Initial migration
    npx prisma generate
    ```

5.  **Start the Application:**

    Now you can start the Next.js development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application should be running at `http://localhost:3000`.

## Key Configuration Notes

- **.env.local:** This file is crucial for storing your sensitive information (database credentials, secrets). Do not commit this file to your version control system (e.g., Git). It's already in `.gitignore`.
- **Prisma:**
  - The `prisma/schema.prisma` file defines your database schema.
  - `npx prisma migrate dev` applies changes to your database schema.
  - `npx prisma generate` generates the Prisma Client, which you use to interact with your database in your application code.
- **JWT_SECRET:** This secret is used to sign and verify JSON Web Tokens (JWTs) for authentication. It's essential for security. Generate a strong, random string for this.
- **Database URL:** Ensure the `DATABASE_URL` in your `.env.local` file is correct and points to your PostgreSQL database.

## API Endpoints

Here's a summary of the API endpoints we've discussed:

- `/api/artworks/[id]`:
  - `GET`: Fetches a single artwork by ID.
  - `DELETE`: Deletes an artwork by ID.
- `/api/userArtworks`:
  - `GET`: (Disabled) Fetches user's exhibitions.
  - `POST`: (Disabled) Creates a new artwork.
- `/api/exhibitions`:
  - `GET`: Fetches exhibitions
- `/api/exhibitions/[exhibitionId]/external-artworks`:
  - `POST`: Adds an artwork from an external API to an exhibition.

## Important Considerations

- **Security:** Protect your `.env.local` file and keep your `JWT_SECRET` secure. Never expose them in your client-side code.
- **Database Migrations:** Use Prisma migrations to manage your database schema changes. This ensures that your database is always in sync with your application.
- **Error Handling:** Implement robust error handling in your API routes and components to provide a better user experience.
- **Authorization:** Ensure proper authorization to protect your API endpoints. For example, only allow the owner of an artwork to delete it.

## Next Steps Art Nest

- Better improve the folder structure of the app.
- Add a dedicated dynamic Error component.
- Deploy the application to a production environment.
