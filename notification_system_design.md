# Notification System Design

## Overview
This document outlines the architecture and design of the campus notification system built for Affordmed's Campus Hiring Evaluation.

## Components

### 1. Logging Middleware
- Reusable TypeScript package
- Sends logs to Affordmed's evaluation server
- Used throughout frontend and backend
- Log function signature: Log(stack, level, package, message)

### 2. Backend (notification_app_be)
- Priority inbox algorithm
- Fetches notifications from evaluation server
- Ranks notifications by weight and recency

### 3. Frontend (notification_app_fe)
- React/Next.js application
- Displays all notifications with filtering
- Priority inbox view with top N notifications
- Material UI for styling

## Architecture

### Tech Stack
- Frontend: Next.js / React with TypeScript
- Styling: Material UI
- Logging: Custom logging middleware (TypeScript)
- API: Affordmed Evaluation Server

### Key Features
- Priority inbox based on notification type and recency
- Filter notifications by type (Result, Placement, Event)
- Real-time notification display
- Mandatory logging throughout codebase

## Stage 1

### Priority Inbox Algorithm

#### Approach
Notifications are ranked using a combination of type weight and recency.

#### Weight System
- Result → 3 (highest)
- Placement → 2
- Event → 1 (lowest)

#### Priority Score Formula
Priority Score = (Type Weight × 10^13) + Timestamp in milliseconds

#### Why this works
- Weight ensures Result always ranks above Placement and Event
- Timestamp breaks ties within same type — newer notifications rank higher
- Top N is configurable (default 10, can be 15, 20, etc.)

#### Handling new notifications
- Algorithm re-fetches and re-sorts on every call
- Always maintains correct top N efficiently
- No database needed — stateless computation on every fetch