"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  AppBar,
  Toolbar,
  Button,
  Slider,
  Paper
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Notification {
  ID: string;
  Type: "Result" | "Placement" | "Event";
  Message: string;
  Timestamp: string;
}

const typeColors: Record<string, "success" | "primary" | "warning"> = {
  Result: "success",
  Placement: "primary",
  Event: "warning"
};

const sortByPriority = (notifications: Notification[]) => {
  const weightMap: Record<string, number> = {
    Result: 3,
    Placement: 2,
    Event: 1
  };

  return [...notifications].sort((a, b) => {
    const wa = weightMap[a.Type] || 0;
    const wb = weightMap[b.Type] || 0;

    if (wa !== wb) return wb - wa;

    return (
      new Date(b.Timestamp).getTime() -
      new Date(a.Timestamp).getTime()
    );
  });
};

export default function Home() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filtered, setFiltered] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [topN, setTopN] = useState(10);

  // ✅ FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        console.log("API DATA:", data);

        const list = data.notifications || [];

        setNotifications(list);
        setFiltered(list);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FIXED LOGIC (FILTER → SORT → SLICE)
  useEffect(() => {
    let data = [...notifications];

    // 1. Filter first
    if (filter !== "All") {
      data = data.filter((n) => n.Type === filter);
    }

    // 2. Sort by priority
    data = sortByPriority(data);

    // 3. Take top N
    const top = data.slice(0, topN);

    setFiltered(top);
  }, [notifications, filter, topN]);

  const handleFilter = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (!newFilter) return;
    setFilter(newFilter);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button color="inherit" onClick={() => router.push("/priority")}>
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          All Notifications
        </Typography>

        {/* Slider */}
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

        {/* Filters */}
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

        {/* UI */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filtered.length === 0 ? (
          <Typography>No notifications found.</Typography>
        ) : (
          filtered.map((notif) => (
            <Card key={notif.ID} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <Typography variant="h6">{notif.Message}</Typography>
                  <Chip
                    label={notif.Type}
                    color={typeColors[notif.Type]}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" mt={1}>
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