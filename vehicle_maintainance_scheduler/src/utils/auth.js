const axios = require("axios");

const credentials = {
    email: "aryan.kumar3_cs23@gla.ac.in",
    name: "aryan kumar",
    rollNo: "2315000466",
    accessCode: "RPsgYt",
    clientID: "a478d47e-55e3-4b48-a95e-a6acc2a28b89",
    clientSecret: "WXVunWMxCGxMaPQc"
};

let cachedToken = null;
let tokenExpiresAt = 0; // Unix timestamp in seconds

const getToken = async () => {
    const now = Math.floor(Date.now() / 1000);
    // If token exists and is not expired (with 10 seconds buffer), return it
    if (cachedToken && tokenExpiresAt > now + 10) {
        return cachedToken;
    }

    try {
        const response = await axios.post("http://4.224.186.213/evaluation-service/auth", credentials);
        cachedToken = response.data.access_token;
        tokenExpiresAt = response.data.expires_in;
        return cachedToken;
    } catch (error) {
        console.error("Authentication failed:", error.message);
        throw error;
    }
};

module.exports = {
    getToken
};
