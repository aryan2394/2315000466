const axios = require("axios");
const { optimizeTasks } = require("../utils/knapsack");
const { getToken } = require("../utils/auth");
const Log = require("../../../loggingMiddleware/logger");

const getOptimizedSchedule = async (req, res) => {
    try {
        await Log("backend", "info", "controller", "GET /api/schedule received");

        // Fetch active token
        const token = await getToken();

        // Fetch depots from protected endpoint
        await Log("backend", "debug", "controller", "Fetching depots data");
        const depotsResponse = await axios.get("http://4.224.186.213/evaluation-service/depots", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const depots = depotsResponse.data.depots;
        await Log("backend", "debug", "controller", `Fetched ${depots.length} depots successfully`);

        // Fetch vehicles from protected endpoint
        await Log("backend", "debug", "controller", "Fetching vehicles data");
        const vehiclesResponse = await axios.get("http://4.224.186.213/evaluation-service/vehicles", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const vehicles = vehiclesResponse.data.vehicles;
        await Log("backend", "debug", "controller", `Fetched ${vehicles.length} vehicles successfully`);

        // Run knapsack optimization for each depot
        await Log("backend", "info", "controller", "Running knapsack optimization");
        const results = depots.map(depot => {
            const optimization = optimizeTasks(vehicles, depot.MechanicHours);
            return {
                depotId: depot.ID,
                availableHours: depot.MechanicHours,
                ...optimization
            };
        });
        await Log("backend", "info", "controller", "Optimized schedules successfully");

        res.status(200).json({
            success: true,
            result: results
        });

    } catch (error) {
        const errorMsg = error.response ? (error.response.data.message || error.response.statusText) : error.message;
        await Log("backend", "error", "controller", `Failed: ${errorMsg.slice(0, 38)}`);
        res.status(500).json({
            success: false,
            message: errorMsg
        });
    }
};

module.exports = {
    getOptimizedSchedule
};