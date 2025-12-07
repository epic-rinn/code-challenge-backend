export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Birds API",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [{ url: "/" }],
  tags: [{ name: "health" }, { name: "birds" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        tags: ["health"],
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Service healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
          "503": {
            description: "Service degraded (DB error)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/birds": {
      get: {
        summary: "List birds",
        tags: ["birds"],
        operationId: "listBirds",
        parameters: [
          { in: "query", name: "species", schema: { type: "string" } },
          { in: "query", name: "name", schema: { type: "string" } },
          { in: "query", name: "habitat", schema: { type: "string" } },
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1 },
          },
          {
            in: "query",
            name: "pageSize",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of birds",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BirdList" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create bird",
        tags: ["birds"],
        operationId: "createBird",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BirdCreateInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bird" },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/birds/{id}": {
      get: {
        summary: "Get bird by id",
        tags: ["birds"],
        operationId: "getBird",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Bird",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bird" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update bird",
        tags: ["birds"],
        operationId: "updateBird",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BirdUpdateInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Bird" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete bird",
        tags: ["birds"],
        operationId: "deleteBird",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": { description: "Deleted" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Bird: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          species: { type: "string", nullable: true },
          habitat: { type: "string", nullable: true },
          created_at: { type: "string" },
        },
        required: ["id", "name", "created_at"],
      },
      BirdList: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Bird" },
          },
          page: { type: "integer" },
          pageSize: { type: "integer" },
          total: { type: "integer" },
        },
        required: ["items", "page", "pageSize", "total"],
      },
      BirdCreateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          species: { type: "string", nullable: true },
          habitat: { type: "string", nullable: true },
        },
        required: ["name"],
      },
      BirdUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", nullable: true },
          species: { type: "string", nullable: true },
          habitat: { type: "string", nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: { error: { type: "string" } },
        required: ["error"],
      },
      MemoryStats: {
        type: "object",
        properties: {
          rss: { type: "integer" },
          heapUsed: { type: "integer" },
          heapTotal: { type: "integer" },
        },
        required: ["rss", "heapUsed", "heapTotal"],
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["ok", "degraded"] },
          db: { type: "string", enum: ["ok", "error"] },
          dbError: { type: "string", nullable: true },
          env: { type: "string" },
          pid: { type: "integer" },
          uptime: { type: "number" },
          now: { type: "string" },
          memory: { $ref: "#/components/schemas/MemoryStats" },
        },
        required: ["status", "db", "env", "pid", "uptime", "now", "memory"],
      },
    },
  },
} as const;
