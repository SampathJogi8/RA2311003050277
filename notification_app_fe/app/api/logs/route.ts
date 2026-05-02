import { NextResponse } from "next/server";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzcDg3MTJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNzc3MCwiaWF0IjoxNzc3NzA2ODcwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGMwZjk0MTUtZWU0YS00Y2MyLWIyNmItMTlhNTU4YjQzMzQ3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHVzYWxhIHNhbXBhdGggam9naSIsInN1YiI6IjA3MzI5MmRlLWQ1ZjItNDc2OS05ZWY1LWM5N2EzZGQ4MjZiNCJ9LCJlbWFpbCI6InNwODcxMkBzcm1pc3QuZWR1LmluIiwibmFtZSI6InB1c2FsYSBzYW1wYXRoIGpvZ2kiLCJyb2xsTm8iOiJyYTIzMTEwMDMwNTAyNzciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIwNzMyOTJkZS1kNWYyLTQ3NjktOWVmNS1jOTdhM2RkODI2YjQiLCJjbGllbnRTZWNyZXQiOiJmQ2Jod0Z4eEZIeHBrREZzIn0.WXdfzBr1Vk5ytaoxHfz3qbeH795B4QPVmKQr3ynNs4A";
const BASE_URL = "http://20.207.122.201/evaluation-service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(`${BASE_URL}/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Logging failed" }, { status: 500 });
    }
}