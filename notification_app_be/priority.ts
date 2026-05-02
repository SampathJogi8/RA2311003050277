import axios from "axios";
import { setAuthToken, Log } from "../logging_middleware/src/index";

// ---- CONFIG ----
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcDg3MTJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjQ2NywiaWF0IjoxNzc3NzAxNTY3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmY3YmUwNzMtNjhmMy00ZDRjLWI2MjgtOTkzNGQwMDZhMjA5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHVzYWxhIHNhbXBhdGggam9naSIsInN1YiI6IjA3MzI5MmRlLWQ1ZjItNDc2OS05ZWY1LWM5N2EzZGQ4MjZiNCJ9LCJlbWFpbCI6InNwODcxMkBzcm1pc3QuZWR1LmluIiwibmFtZSI6InB1c2FsYSBzYW1wYXRoIGpvZ2kiLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAyNzciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIwNzMyOTJkZS1kNWYyLTQ3NjktOWVmNS1jOTdhM2RkODI2YjQiLCJjbGllbnRTZWNyZXQiOiJmQ2Jod0Z4eEZIeHBrREZzIn0.89S-yVxAbTQVhO_zEmbRkjT2Rr60gBwgNrJVIDvKaZs";
const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOP_N = 10; // change to 15 or 20 as needed

// ---- SETUP ----
setAuthToken(TOKEN);

// ---- TYPES ----
interface Notification {
    ID: string;
    Type: "Result" | "Placement" | "Event";
    Message: string;
    Timestamp: string;
}

// ---- WEIGHT MAP ----
const weightMap: Record<string, number> = {
    Result: 3,
    Placement: 2,
    Event: 1
};

// ---- PRIORITY SCORE ----
const getPriorityScore = (notification: Notification): number => {
    const weight = weightMap[notification.Type] || 0;
    const recency = new Date(notification.Timestamp).getTime();
    return weight * 1e13 + recency;
};

// ---- MAIN FUNCTION ----
const getTopNNotifications = async (n: number): Promise<void> => {
    try {
        await Log("frontend", "info", "api", "Fetching notifications from server");

        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        const notifications: Notification[] = response.data.notifications;

        await Log("frontend", "info", "api", `Fetched ${notifications.length} notifications`);

        // Sort by priority score
        const sorted = notifications.sort(
            (a, b) => getPriorityScore(b) - getPriorityScore(a)
        );

        // Get top N
        const topN = sorted.slice(0, n);

        await Log("frontend", "info", "page", `Displaying top ${n} priority notifications`);

        // Display results
        console.log(`\n===== TOP ${n} PRIORITY NOTIFICATIONS =====\n`);
        topN.forEach((notif, index) => {
            console.log(`${index + 1}. [${notif.Type}] ${notif.Message}`);
            console.log(`   Time: ${notif.Timestamp}`);
            console.log(`   ID: ${notif.ID}`);
            console.log(`   Score: ${getPriorityScore(notif)}`);
            console.log("---");
        });

    } catch (error) {
        await Log("frontend", "error", "api", `Failed to fetch notifications: ${error}`);
        console.error("Error fetching notifications:", error);
    }
};

// ---- RUN ----
getTopNNotifications(TOP_N);