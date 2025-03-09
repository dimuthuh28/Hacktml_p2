const axios = require("axios");
require("dotenv").config();

// API keys and endpoints
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Check for API key
if (!GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
    process.exit(1);
}

exports.askSpiriter = async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        console.log("=========== NEW SPIRITER REQUEST ===========");
        console.log(`Processing request: "${userMessage}"`);
        
        // Fetch player data from the local API endpoint with detailed debugging
        let players = [];
        try {
            console.log("Attempting to fetch player data from API...");
            const playerResponse = await axios.get('http://localhost:5000/api/players', {
                timeout: 10000 // 10 second timeout for the local API
            });
            
            // Log raw response to understand what we're getting
            console.log("API Response Status:", playerResponse.status);
            console.log("Raw API response sample:", JSON.stringify(playerResponse.data).substring(0, 500) + "...");
            
            // Check data structure more explicitly
            if (playerResponse.data) {
                if (Array.isArray(playerResponse.data)) {
                    players = playerResponse.data;
                    console.log("✅ Data is an array with", players.length, "items");
                    if (players.length > 0) {
                        console.log("First player sample:", JSON.stringify(players[0]));
                    }
                } else if (playerResponse.data.players && Array.isArray(playerResponse.data.players)) {
                    players = playerResponse.data.players;
                    console.log("✅ Data is in players property with", players.length, "items");
                    if (players.length > 0) {
                        console.log("First player sample:", JSON.stringify(players[0]));
                    }
                } else {
                    // Try to auto-detect the structure
                    const keys = Object.keys(playerResponse.data);
                    console.log("Available keys in response:", keys);
                    
                    // Look for any array that might contain players
                    for (const key of keys) {
                        if (Array.isArray(playerResponse.data[key]) && playerResponse.data[key].length > 0) {
                            console.log(`Found array in key "${key}" with ${playerResponse.data[key].length} items`);
                            if (typeof playerResponse.data[key][0] === 'object') {
                                console.log(`Using data from "${key}" field as it contains objects`);
                                players = playerResponse.data[key];
                                break;
                            }
                        }
                    }
                    
                    if (players.length === 0) {
                        throw new Error("Unknown data structure, could not find players array");
                    }
                }
            } else {
                throw new Error("Empty data received from API");
            }
        } catch (fetchError) {
            console.error("❌ Error fetching player data:", fetchError.message);
            if (fetchError.response) {
                console.error("Response status:", fetchError.response.status);
                console.error("Response data:", fetchError.response.data);
            }
            return res.status(500).json({ error: "Failed to fetch player data: " + fetchError.message });
        }
        
        if (!players || players.length === 0) {
            console.error("❌ No player data found after processing");
            return res.status(500).json({ error: "No player data available" });
        }
        
        // Analyze the actual data structure to detect field names
        console.log(`Found ${players.length} players total`);
        
        // Find what fields are actually available in the player data
        if (players.length > 0) {
            const samplePlayer = players[0];
            console.log("Available fields for first player:", Object.keys(samplePlayer));
            
            // Look for fields containing common cricket stat terms
            const runFields = Object.keys(samplePlayer).filter(key => 
                key.toLowerCase().includes('run'));
            const wicketFields = Object.keys(samplePlayer).filter(key => 
                key.toLowerCase().includes('wicket'));
            const overFields = Object.keys(samplePlayer).filter(key => 
                key.toLowerCase().includes('over'));
            const inningFields = Object.keys(samplePlayer).filter(key => 
                key.toLowerCase().includes('inning'));
            
            console.log("Possible run-related fields:", runFields);
            console.log("Possible wicket-related fields:", wicketFields);
            console.log("Possible over-related fields:", overFields);
            console.log("Possible innings-related fields:", inningFields);
            
            // Determine field mapping based on actual data structure
            const fieldMap = {
                totalRuns: runFields.find(f => f.toLowerCase().includes('total')) || 
                           runFields[0] || 'Total Runs',
                wickets: wicketFields[0] || 'Wickets',
                oversBowled: overFields.find(f => f.toLowerCase().includes('bowl')) || 
                             overFields[0] || 'Overs Bowled',
                runsConceded: runFields.find(f => f.toLowerCase().includes('conceded')) || 
                              'Runs Conceded',
                ballsFaced: Object.keys(samplePlayer).find(k => 
                            k.toLowerCase().includes('ball') && 
                            k.toLowerCase().includes('faced')) || 'Balls Faced',
                inningsPlayed: inningFields.find(f => f.toLowerCase().includes('played')) || 
                               inningFields[0] || 'Innings Played'
            };
            
            console.log("Using field mapping:", fieldMap);
            
            // Verify if players actually have these fields
            let statCheckResults = {
                hasTotalRuns: false,
                hasWickets: false,
                hasOvers: false,
                hasRunsConceded: false
            };
            
            players.forEach(player => {
                if (player.stats && player.stats[fieldMap.totalRuns] !== undefined) statCheckResults.hasTotalRuns = true;
                if (player.stats && player.stats[fieldMap.wickets] !== undefined) statCheckResults.hasWickets = true;
                if (player.stats && player.stats[fieldMap.oversBowled] !== undefined) statCheckResults.hasOvers = true;
                if (player.stats && player.stats[fieldMap.runsConceded] !== undefined) statCheckResults.hasRunsConceded = true;
            });
            
            console.log("Data check results:", statCheckResults);
            
            if (!statCheckResults.hasTotalRuns && !statCheckResults.hasWickets) {
                console.warn("⚠️ WARNING: Players may not have standard stat fields, adapting...");
                
                // Try to extract any numeric fields as potential stats
                const numericFields = Object.keys(samplePlayer).filter(key => 
                    typeof samplePlayer[key] === 'number');
                console.log("Available numeric fields:", numericFields);
                
                if (numericFields.length > 0) {
                    console.log("Will use available numeric fields as stats");
                }
            }
            
            // Create more adaptive format function based on detected fields
            const formatPlayerData = (player) => {
                // Fix: Get player name from firstName and lastName fields
                if (!player.Name && !player.name) {
                    if (player.firstName && player.lastName) {
                        player.name = `${player.firstName} ${player.lastName}`;
                    } else {
                        // Try to find any field that might contain a name
                        const nameFields = Object.keys(player).filter(k => 
                            k.toLowerCase().includes('name') || 
                            k.toLowerCase().includes('player') ||
                            k.toLowerCase().includes('first') ||
                            k.toLowerCase().includes('last'));
                        
                        if (nameFields.length > 0) {
                            // Collect all potential name parts
                            const nameParts = nameFields.map(field => player[field]).filter(Boolean);
                            if (nameParts.length > 0) {
                                player.name = nameParts.join(' ');
                            } else {
                                console.warn("⚠️ Player without usable name field:", player);
                                player.name = `Player_${player._id ? player._id.substring(0, 6) : Math.random().toString(36).substring(2, 8)}`;
                            }
                        } else {
                            console.warn("⚠️ Player without any name-like fields:", player);
                            player.name = `Player_${player._id ? player._id.substring(0, 6) : Math.random().toString(36).substring(2, 8)}`;
                        }
                    }
                }
                
                // Use detected Name field
                const name = player.Name || player.name;
                
                // Use detected Category/Role field
                const categoryField = Object.keys(player).find(k => 
                    k.toLowerCase() === 'category' || 
                    k.toLowerCase() === 'role' || 
                    k.toLowerCase().includes('type'));
                
                const category = player[categoryField] || 'player';
                
                // Build stats based on what's available
                let stats = '';
                
                // Check if stats are nested under a stats object
                const statsObject = player.stats || player;
                
                // Add batting stats if available
                if (statsObject[fieldMap.totalRuns] !== undefined) {
                    stats += `R:${statsObject[fieldMap.totalRuns]}`;
                }
                
                if (statsObject[fieldMap.ballsFaced] !== undefined) {
                    stats += stats ? `,BF:${statsObject[fieldMap.ballsFaced]}` : `BF:${statsObject[fieldMap.ballsFaced]}`;
                }
                
                if (statsObject[fieldMap.inningsPlayed] !== undefined) {
                    stats += stats ? `,IP:${statsObject[fieldMap.inningsPlayed]}` : `IP:${statsObject[fieldMap.inningsPlayed]}`;
                }
                
                // Add bowling stats if available
                if (statsObject[fieldMap.wickets] !== undefined) {
                    stats += stats ? `|W:${statsObject[fieldMap.wickets]}` : `W:${statsObject[fieldMap.wickets]}`;
                }
                
                if (statsObject[fieldMap.oversBowled] !== undefined) {
                    stats += stats ? `,OB:${statsObject[fieldMap.oversBowled]}` : `OB:${statsObject[fieldMap.oversBowled]}`;
                }
                
                if (statsObject[fieldMap.runsConceded] !== undefined) {
                    stats += stats ? `,RC:${statsObject[fieldMap.runsConceded]}` : `RC:${statsObject[fieldMap.runsConceded]}`;
                }
                
                // If no standard stats found, include calculated fields
                if (!stats && player.calculated) {
                    let calcStats = [];
                    Object.keys(player.calculated).forEach(key => {
                        if (typeof player.calculated[key] === 'number') {
                            calcStats.push(`${key}:${player.calculated[key]}`);
                        }
                    });
                    
                    if (calcStats.length > 0) {
                        stats = calcStats.join(',');
                    }
                }
                
                // If still no stats, include any numeric field
                if (!stats) {
                    let numStats = [];
                    Object.keys(player).forEach(key => {
                        if (typeof player[key] === 'number') {
                            numStats.push(`${key}:${player[key]}`);
                        }
                    });
                    
                    if (numStats.length > 0) {
                        stats = numStats.join(',');
                    } else {
                        stats = "No numeric stats available";
                    }
                }
                
                return `${name}(${category})=${stats}`;
            };
            
            // Format player data using adaptive formatter
            const playerInfo = players.map(formatPlayerData)
                                    .filter(info => info !== "")
                                    .join(" • ");
            
            console.log("Formatted player info sample:", playerInfo.substring(0, 300) + "...");
            
            // Prepare prompt with more detailed instructions and explicit data
            const fullPrompt = `
You are Spirit11's professional cricket analyst. I'm providing you with SPECIFIC player data that you MUST use to answer the following question:

USER QUESTION: "${userMessage}"

PLAYER DATA: 
${playerInfo}

IMPORTANT INSTRUCTIONS:
1. The above PLAYER DATA is REAL and you MUST use it to answer the question.
2. If asked about stats like "who has the most runs", ANALYZE the actual numbers in the data.
3. The data contains batting stats (R=Runs, BF=Balls Faced, IP=Innings Played) and/or bowling stats (W=Wickets, OB=Overs Bowled, RC=Runs Conceded).
4. DO NOT say you need more data - the data is already provided above. Use what is available.
5. DO NOT say "I cannot determine" unless the data truly has NO relevant information.
6. Always look through ALL player data to find the answers.
7. Make your response clear, direct and factual based ONLY on the provided player data.
`;

            console.log("Prompt length:", fullPrompt.length);
            
            // Call Gemini API with improved error handling and timeout
            console.log("Sending request to Gemini API...");
            const response = await axios.post(GEMINI_API_URL, {
                contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    temperature: 0.1, // Very low temperature for factual responses
                    maxOutputTokens: 800
                }
            }, {
                timeout: 20000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Received response from Gemini API");
            
            // Validate response
            if (!response.data) {
                throw new Error("Empty response from Gemini API");
            }
            
            if (!response.data.candidates || !response.data.candidates[0]) {
                console.error("Unexpected API response structure:", JSON.stringify(response.data).substring(0, 200));
                throw new Error("Invalid response structure from Gemini API");
            }
            
            const reply = response.data.candidates[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process the request.";
            
            console.log("Response preview:", reply.substring(0, 100) + "...");
            console.log("=========== END REQUEST ===========");
            
            res.json({ reply });
        } else {
            throw new Error("Unable to analyze player data structure - no players found");
        }
    } catch (error) {
        console.error("❌ Error in askSpiriter:", error.message);
        
        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: "Request to Gemini API timed out. Try asking a more specific question." });
        } else if (error.response) {
            console.error("API Error Details:", JSON.stringify(error.response.data || {}).substring(0, 300));
            return res.status(error.response.status).json({ 
                error: `Gemini API error: ${error.response.data?.error?.message || 'Unknown error'}`
            });
        } else if (error.request) {
            return res.status(503).json({ error: "No response received from Gemini API" });
        }
        
        res.status(500).json({ 
            error: "Something went wrong with Spiriter AI!",
            message: error.message
        });
    }
};