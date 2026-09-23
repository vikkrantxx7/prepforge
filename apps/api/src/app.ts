import Fastify from 'fastify'
import cors from '@fastify/cors'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.register(cors, {
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  })

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
