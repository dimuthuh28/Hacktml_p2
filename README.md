# Spirit11 Fantasy Cricket League

Spirit11 is an interactive web application that lets users create their fantasy cricket teams, manage players, and track points based on real-time player performance. Users can compete with others, track their team's position on the leaderboard, and get assistance from an AI-powered chatbot to make informed decisions.

## Prerequisites

Before running the project, ensure that you have the following installed:

-   **Node.js** (v14.x or higher)
-   **MongoDB** (local or cloud setup)
-   **Git** (for cloning the repository)


## Instructions to Run the Project

Follow these steps to get your project up and running:

### 1. Clone the Repository
`git clone https://github.com/dimuthuh28/Hacktml_p2`

`cd Hacktml_p2` 

### 2. Install Dependencies
Run the following command in both the client and server directories to install required dependencies.
#### Server (Backend)
`cd backend`
`npm install` 

#### Client (Frontend)
`cd frontend`
`npm install` 

### 3. Database Setup & Configuration

The project uses **MongoDB** for the database. You can use either a local MongoDB instance or a cloud-based MongoDB like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

-   Create a `.env` file in the root directory of the server and configure the MongoDB connection string:
`MONGO_URI=mongodb://your_mongo_connection_string_here
PORT=5000` 

### 4. Run the Project
Once you have set up the database, run the following commands in their respective directories:

#### Start the Server
`cd backend`
`npm run dev` 

#### Start the Client

`cd frontend`
`npm start` 

Now, you can access the project by navigating to `http://localhost:3000/` in your web browser.


## Assumptions Made During Development

-   **User Authentication**: Users can sign up and log in using email/password. No third-party authentication (e.g., Google or Facebook login) is integrated.
-   **Player Budget**: Users select players for their fantasy teams using a fixed budget.
-   **Team Size**: Each fantasy team has 11 players.
-   **Player Performance Data**: The project uses static player performance data for testing. In a real-world scenario, this would be dynamically fetched from external APIs.
-   **Leaderboard**: Points are calculated based on overall performance, and the leaderboard is updated accordingly.




