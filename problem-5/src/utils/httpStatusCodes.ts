export enum HttpStatus {
  // 2xx — Successful responses
  OK = 200, // Request succeeded
  CREATED = 201, // Resource created
  NO_CONTENT = 204, // No content to return

  // 4xx — Client errors
  BAD_REQUEST = 400, // Invalid request payload/params
  UNAUTHORIZED = 401, // Missing/invalid authentication
  FORBIDDEN = 403, // Authenticated but not allowed
  NOT_FOUND = 404, // Resource/route not found
  CONFLICT = 409, // State conflict
  TOO_MANY_REQUESTS = 429, // Rate limited

  // 5xx — Server errors
  INTERNAL_SERVER_ERROR = 500, // Generic server error
  SERVICE_UNAVAILABLE = 503, // Temporary overload/maintenance
}
