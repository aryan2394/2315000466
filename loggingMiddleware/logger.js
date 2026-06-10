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
    if (cachedToken && tokenExpiresAt > now + 10) {
        return cachedToken;
    }

    try {
        const response = await axios.post("http://4.224.186.213/evaluation-service/auth", credentials);
        cachedToken = response.data.access_token;
        tokenExpiresAt = response.data.expires_in;
        return cachedToken;
    } catch (error) {
        console.error("Logging auth failed:", error.message);
        throw error;
    }
};

const Log = async (stack, level, packageName, message) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Log Created:", response.data);

    } catch (error) {
        console.log("Logging Failed:", error.response ? (error.response.data.message || error.response.statusText) : error.message);
    }
};

module.exports = Log;