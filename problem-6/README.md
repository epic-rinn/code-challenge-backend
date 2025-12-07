# Problem 6: Architecture

The document specifies the comprehensive specification of the architecture for real-time scoreboard module that displays top 10 user scores and the submission of action completion by the authorized user.

![Scoreboard Architecture Diagram](diagram.png)

## 1. System Flow

Scoreboard Module

- Displays top 10 user scores with real-time updates in descending order.
- Authorized user can submit action completion to update the score.
- Scoreboard Module updates the score cache and broadcasts the updated top 10 scores to all the connected clients.
- Unauthorized user cannot submit action completion.
- Malicious user cannot repeatedly submit action completion to manipulate the score.

## 2. Architecture

### 2.1 System Components

1. API Layer: Node.js Server(Express.js/Nest.js/Fastify)
2. Authentication Layer: JWT (JSON Web Token)
3. Database Layer: Relational Database(PostgreSQL)
4. Cache Layer: In-Memory Data Store(Redis or Memcached)
5. Event Bus: Apache Kafka or RabbitMQ
6. Real Time Event: Server Sent Events(SSE) (Unidirectional Communication)
7. Observability: Logging, Monitoring, and Tracing with standard prefixes for log messages and metrics.

### 2.2 Real Time Communication

1. Client establishes SSE connection to `/api/scoreboard/stream`.
2. Server maintains connection and sends events whenever it receives event from Event Bus.
3. Scoreboard Module checks if the score update causes the user to be in the top 10, if yes, update redis cache and dispatch event (`score:update`) to Event Bus.
4. All SSE Manager instances consume from the event and pushes `score:update` event type with the updated top 10 scores to the connected clients.

### 2.3 Authentication

1. Client includes JWT token in the `Authorization` header for each request.
2. Server verifies the token and extracts the `userId` from the payload.
3. Server uses the `userId` to identify the user and authorize the request.

### 2.4 Rate Limiting

API Server performs rate limiting to prevent abuse of all of the endpoints by ip address.

## 3. API Specifications

### 3.1 REST API Endpoints

#### `POST /api/actions`

**Description:** Submits action completion to update the score for the `userId` provided in the jwt payload.
The score is updated only if the action is not granted previously which means `actionId` and `userId` are not in the `ledger` table.

The endpoint returns

- `200` when the action is successfully submitted.
- `403` when the user is not authorized.
- `400` when the `actionId` is missing or attempt to submit score granted action repeatedly.

**Headers:** - `Authorization: Bearer <token>`
**Body:**

```json
{ "actionId": "string" }
```

**Response (Success - 200 OK):**

```json
{
  "success": true,
  "message": "Socre Updated"
}
```

#### `GET /api/leaderboard`

**Description:** Returns the top 10 user scores in descending order from the redis cache.

**Response (Success - 200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "userId": "string",
      "score": 1500
    },
    {
      "userId": "string",
      "score": 1400
    }
    // ...
  ]
}
```

### 3.2 SSE Endpoints

#### `GET /api/leaderboard/stream`

**Description:** Establishes SSE connection to receive real-time scoreboard updates.

**Headers:**

```
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Response (Success - 200 OK):**

```
event: connected
data: {"message":"Connected to leaderboard stream"}

event: score:update
data: {"topUsers":[{"userId":"string","score":1500},{"userId":"string","score":1400}],"timestamp":"2024-12-09T14:30:45Z"}
```

## 4. Data Model

### 4.1 Database Schema (PostgreSQL)

#### User

```
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### Scores

```
CREATE TABLE scores (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);

CREATE INDEX idx_scores_score_desc ON scores(score DESC);
```

#### Actions

```
CREATE TABLE actions (
    action_id VARCHAR(100) PRIMARY KEY,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);
```

#### Ledger

```
CREATE TABLE ledger (
    ledger_id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action_id VARCHAR(100) NOT NULL REFERENCES actions(action_id) ON DELETE RESTRICT,
    points_granted INTEGER NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_action UNIQUE (user_id, action_id),
);

CREATE INDEX idx_ledger_user_id ON ledger(user_id);
CREATE INDEX idx_ledger_action_id ON ledger(action_id);
CREATE INDEX idx_ledger_user_action ON ledger(user_id, action_id);
```

### Caching Strategy

#### Cache Key:

```
  key: leaderboard => Top 1 to 10 user & scores
```

#### Cache Invalidation:

```
  Invalidate cache when a user completes an action and the total score is higher than 10th person in the leaderboard.
```

## 5. Deployments Consideration

1. **Horizontal Scaling:** Deploy multiple instances of the Scoreboard Module to handle increased load.
2. **Load Balancing:** Use a load balancer to distribute incoming requests evenly among the instances.
3. **Monitoring & Logging:** For robust system and faster debugging.

## 6. Security Improvements

1. **Rate Limiting:** Implement rate limiting by userId to prevent abuse of the API endpoints.
2. **Token Rotation:** Authorization Token should be short-lived and rotated by Refresh Token to mitigate the risk of token leaking.

## 6. Improvement Ideas

1. **CDN Integration & Edge Servers:** Utilize a Content Delivery Network (CDN) to cache static assets and serve them from edge servers closer to users, reducing latency.
2. **Separate SSE Manager Instances:** Deploy multiple instances of the SSE Manager to handle the real-time communication load and avoid single point of failure.
3. **Short Polling as Fallback:** Implement short polling as a fallback mechanism when SSE connection is not supported or fails.
