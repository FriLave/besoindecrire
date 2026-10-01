import type { Endpoint } from 'payload'

// GET /api/health: liveness + cheap DB ping, used by the Docker HEALTHCHECK and uptime monitors.
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    try {
      await req.payload.count({ collection: 'users', req })
      return Response.json({ status: 'ok' })
    } catch {
      return Response.json({ status: 'error' }, { status: 503 })
    }
  },
}
