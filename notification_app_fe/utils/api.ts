import { Notification } from "../types/notification";
import { Log } from "./logger";

export const fetchNotifications = async (
    limit?: number,
    page?: number,
    notification_type?: string
): Promise<Notification[]> => {
    try {
        await Log("frontend", "info", "api", "Fetching notifications");

        const params = new URLSearchParams();
        if (limit) params.append("limit", limit.toString());
        if (page) params.append("page", page.toString());
        if (notification_type) params.append("notification_type", notification_type);

        const response = await fetch(`/api/notifications?${params.toString()}`);
        const data = await response.json();
        await Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications`);
        return data.notifications;
    } catch (error) {
        await Log("frontend", "error", "api", `Failed to fetch notifications: ${error}`);
        return [];
    }
};

const weightMap: Record<string, number> = {
    Result: 3,
    Placement: 2,
    Event: 1
};

export const getPriorityScore = (notification: Notification): number => {
    const weight = weightMap[notification.Type] || 0;
    const recency = new Date(notification.Timestamp).getTime();
    return weight * 1e13 + recency;
};

export const getTopNByPriority = (
    notifications: Notification[],
    n: number
): Notification[] => {
    return [...notifications]
        .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
        .slice(0, n);
};