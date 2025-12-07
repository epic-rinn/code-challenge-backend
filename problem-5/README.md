# Problem 5: A Crude Server

Minimal Birds API providing CRUD with:

- Pagination via `page` and `pageSize`
- Search by `name` (substring match)
- Filter by `habitat` (exact, case-sensitive)
- Filter by `species` (exact, case-sensitive)

## Requirements

- Node.js (version >= 23.10.0) and pnpm (version >= 10.11.0) installed

## Install

```sh
pnpm install
```

## Environment

Create `.env` in the project root (optional defaults shown):

```env
PORT=3000
```

## Database

- SQLite file is stored at `data/app.db`.
- Apply migrations using Drizzle Kit:

```sh
pnpm exec drizzle-kit migrate
```

## Run (development)

```sh
pnpm run dev
```

## Build and Start (production)

```sh
pnpm run build
pnpm start
```

## Swagger Docs

- UI: `http://localhost:3000/docs`

## cURL Examples

- System health check

```sh
curl -s http://localhost:3000/health
```

- Create a bird

```sh
curl -sS -X POST http://localhost:3000/birds \
  -H 'Content-Type: application/json' \
  --data '{"name":"Eurasian Tree Sparrow","species":"Sparrow","habitat":"Farmland"}'
```

- List birds (pagination)

```sh
curl -s 'http://localhost:3000/birds?page=1&pageSize=10'
```

- Search by name (substring)

```sh
curl -s 'http://localhost:3000/birds?name=spar'
```

- Filter by species (exact, case-sensitive)

```sh
curl -s 'http://localhost:3000/birds?species=Sparrow'
```

- Filter by habitat (exact, case-sensitive)

```sh
curl -s 'http://localhost:3000/birds?habitat=Farmland'
```

- Get bird by id

```sh
curl -s 'http://localhost:3000/birds/1'
```

- Update a bird

```sh
curl -sS -X PUT http://localhost:3000/birds/2 \
  -H 'Content-Type: application/json' \
  --data '{"name":"House Sparrow","habitat":"Urban"}'
```

- Delete a bird

```sh
curl -sS -X DELETE http://localhost:3000/birds/1 -i
```
