import axios from "axios";
import { setAuthToken, Log } from "../logging_middleware/src/index";

// ---- CONFIG ----
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcDg3MTJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTM5MSwiaWF0IjoxNzc3NzA0NDkxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMzM3NTEyYzgtZTU4OC00NjNkLWFiMmQtODU2YzQ0MzJkMzMzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHVzYWxhIHNhbXBhdGggam9naSIsInN1YiI6IjA3MzI5MmRlLWQ1ZjItNDc2OS05ZWY1LWM5N2EzZGQ4MjZiNCJ9LCJlbWFpbCI6InNwODcxMkBzcm1pc3QuZWR1LmluIiwibmFtZSI6InB1c2FsYSBzYW1wYXRoIGpvZ2kiLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAyNzciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIwNzMyOTJkZS1kNWYyLTQ3NjktOWVmNS1jOTdhM2RkODI2YjQiLCJjbGllbnRTZWNyZXQiOiJmQ2Jod0Z4eEZIeHBrREZzIn0.rq_K8caS2Hfam0QF6Yt6kcbW06ObzvsuzRkeJvx9V8g";

const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOP_N = 10;

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
    return weight * 10000000000000 + recency;
};

// ---- MAIN FUNCTION ----
const getTopNNotifications = async (n: number): Promise<void> => {
    try {
        await Log("backend", "info", "controller", "Fetching notifications from server");

        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        const notifications: Notification[] = response.data.notifications;

        console.log("Total notifications:", notifications.length);

        await Log("backend", "info", "controller", `Fetched ${notifications.length} notifications`);

        // Sort by priority
        const sorted = notifications.sort(
            (a, b) => getPriorityScore(b) - getPriorityScore(a)
        );

        // Top N
        const topN = sorted.slice(0, n);

        await Log("backend", "info", "controller", `Displaying top ${n} notifications`);

        // Display
        console.log(`\n===== TOP ${n} PRIORITY NOTIFICATIONS =====\n`);

        topN.forEach((notif, index) => {
            console.log(`${index + 1}. [${notif.Type}] ${notif.Message}`);
            console.log(`   Time: ${notif.Timestamp}`);
            console.log(`   ID: ${notif.ID}`);
            console.log(`   Score: ${getPriorityScore(notif)}`);
            console.log("-----------------------------------");
        });

    } catch (error: any) {
        await Log("backend", "error", "controller", error.message);
        console.error("Error:", error.message);
    }
};

// ---- RUN ----
getTopNNotifications(TOP_N);