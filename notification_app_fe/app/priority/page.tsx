"use client";
import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    AppBar,
    Toolbar,
    Button,
    Slider,
    Paper
} from "@mui/material";
import { fetchNotifications, getTopNByPriority } from "../../utils/api";
import { Notification } from "../../types/notification";
import { Log } from "../../utils/logger";
import { useRouter } from "next/navigation";

const typeColors: Record<string, "success" | "primary" | "warning"> = {
    Result: "success",
    Placement: "primary",
    Event: "warning"
};

export default function PriorityPage() {
    const router = useRouter();
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [filtered, setFiltered] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [topN, setTopN] = useState<number>(10);
    const [filter, setFilter] = useState<string>("All");

    useEffect(() => {
        const load = async () => {
            await Log("frontend", "info", "page", "Priority inbox page loaded");
            const data = await fetchNotifications();
            setAllNotifications(data);
            const top = getTopNByPriority(data, topN);
            setFiltered(top);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        const applyFilter = async () => {
            await Log("frontend", "debug", "state", `Updating priority list — top ${topN}, filter: ${filter}`);
            let base = getTopNByPriority(allNotifications, topN);
            if (filter !== "All") {
                base = base.filter((n) => n.Type === filter);
            }
            setFiltered(base);
        };
        if (allNotifications.length > 0) applyFilter();
    }, [topN, filter, allNotifications]);

    const handleFilter = async (
        _: React.MouseEvent<HTMLElement>,
        newFilter: string
    ) => {
        if (!newFilter) return;
        setFilter(newFilter);
        await Log("frontend", "info", "state", `Priority filter changed to ${newFilter}`);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Priority Inbox
                    </Typography>
                    <Button color="inherit" onClick={() => router.push("/")}>
                        All Notifications
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                    Priority Inbox
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Showing top notifications ranked by type weight and recency
                </Typography>

                {/* Top N Slider */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography gutterBottom>
                        Show Top <strong>{topN}</strong> Notifications
                    </Typography>
                    <Slider
                        value={topN}
                        min={5}
                        max={20}
                        step={5}
                        marks={[
                            { value: 5, label: "5" },
                            { value: 10, label: "10" },
                            { value: 15, label: "15" },
                            { value: 20, label: "20" }
                        ]}
                        onChange={(_, val) => setTopN(val as number)}
                        sx={{ maxWidth: 400 }}
                    />
                </Paper>

                {/* Filter */}
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilter}
                    sx={{ mb: 3 }}
                >
                    {["All", "Result", "Placement", "Event"].map((type) => (
                        <ToggleButton key={type} value={type}>
                            {type}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : filtered.length === 0 ? (
                    <Typography>No notifications found.</Typography>
                ) : (
                    filtered.map((notif, index) => (
                        <Card key={notif.ID} sx={{ mb: 2, border: "2px solid #9c27b0" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                bgcolor: "#9c27b0",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: 32,
                                                height: 32,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 14,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {index + 1}
                                        </Typography>
                                        <Typography variant="h6">{notif.Message}</Typography>
                                    </Box>
                                    <Chip
                                        label={notif.Type}
                                        color={typeColors[notif.Type]}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    {new Date(notif.Timestamp).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Container>
        </Box>
    );
}