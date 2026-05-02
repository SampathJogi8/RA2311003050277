export interface Notification {
    ID: string;
    Type: "Result" | "Placement" | "Event";
    Message: string;
    Timestamp: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
}