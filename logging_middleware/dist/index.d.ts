type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "cache" | "controller" | "cron_job" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "page" | "state" | "style";
type SharedPackage = "auth" | "config" | "middleware" | "utils";
type Package = BackendPackage | FrontendPackage | SharedPackage;
export declare const setAuthToken: (token: string) => void;
export declare const Log: (stack: Stack, level: Level, pkg: Package, message: string) => Promise<void>;
export {};
