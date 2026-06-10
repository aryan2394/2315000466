const optimizeTasks = (vehicles, maxHours) => {
    const n = vehicles.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(maxHours + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        const vehicle = vehicles[i - 1];
        const duration = vehicle.Duration;
        const impact = vehicle.Impact;
        
        for (let w = 0; w <= maxHours; w++) {
            if (duration <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    const selectedVehicles = [];
    let w = maxHours;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            const vehicle = vehicles[i - 1];
            selectedVehicles.push(vehicle);
            w -= vehicle.Duration;
        }
    }
    
    selectedVehicles.reverse();
    const totalDuration = selectedVehicles.reduce((sum, v) => sum + v.Duration, 0);
    const totalImpact = selectedVehicles.reduce((sum, v) => sum + v.Impact, 0);
    
    return {
        totalDuration,
        totalImpact,
        selectedVehicles
    };
};

module.exports = {
    optimizeTasks
};