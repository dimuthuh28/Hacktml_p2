const fs = require("fs");
const csv = require("csv-parser");

let playersCache = []; 
let lastCacheTime = null; 
const CACHE_LIFETIME = 60 * 60 * 1000;

const loadPlayers = (filePath) => {
    return new Promise((resolve, reject) => {
        if (playersCache.length > 0 && (Date.now() - lastCacheTime) < CACHE_LIFETIME) {
            console.log("Returning cached player data");
            return resolve(playersCache); // Use cached data if it’s still valid
        }

        const players = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                players.push({
                    name: row.name,
                    role: row.role,
                    price: row.price,
                    form: row.form,
                });
            })
            .on("end", () => {
                // Update cache and the last cache time
                playersCache = players;
                lastCacheTime = Date.now();
                console.log("Caching new player data");
                resolve(players);
            })
            .on("error", (err) => {
                console.error("Error reading CSV file", err);
                reject(err);
            });
    });
};

module.exports = loadPlayers;
