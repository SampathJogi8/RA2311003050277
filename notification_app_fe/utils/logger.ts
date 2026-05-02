type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "api" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

export const Log = async (
    stack: Stack,
    level: Level,
    pkg: Package,
    message: string
): Promise<void> => {
    try {
        await fetch("/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stack, level, package: pkg, message })
        });
    } catch (error) {
        console.error("[LOG FAILED]", error);
    }
};