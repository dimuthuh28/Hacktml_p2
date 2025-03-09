require("dotenv").config();
const axios = require("axios");
const loadPlayers = require("../utils/loadPlayer");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure your API key is stored in .env file
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const askSpiriter = async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Load player data from CSV file
        const players = await loadPlayers("data/players.csv");

        // Format player data (excluding university and only keeping relevant stats)
        const playerInfo = players.map(p => {
            if (p.Category === "batsman") {
                return `${p.Name} - ${p.Category}, Runs: ${p['Total Runs']}, Balls Faced: ${p['Balls Faced']}, Innings Played: ${p['Innings Played']}`;
            } else if (p.Category === "bowler") {
                return `${p.Name} - ${p.Category}, Wickets: ${p['Wickets']}, Overs Bowled: ${p['Overs Bowled']}, Runs Conceded: ${p['Runs Conceded']}`;
            } else if (p.Category === "all-rounder") {
                return `${p.Name} - ${p.Category}, Runs: ${p['Total Runs']}, Wickets: ${p['Wickets']}, Overs Bowled: ${p['Overs Bowled']}, Runs Conceded: ${p['Runs Conceded']}`;
            }
            return ''; // Exclude players with no category or incomplete data
        }).filter(info => info !== "").join("\n");

        const fullPrompt = `
            You are an expert in fantasy cricket for Spirit11.
            Here is the available player data (without points):

            ${playerInfo}

            Respond based on this information, but DO NOT include any player's points in the answer.
            
            The user asks: "${userMessage}"
        `;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        });

        const reply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({ error: "Something went wrong with Spiriter AI!" });
    }
};

module.exports = { askSpiriter };
