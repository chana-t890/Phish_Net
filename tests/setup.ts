const globals = globalThis as Record<string, unknown>

globals.defineEventHandler = (handler: unknown) => handler
globals.readBody = async (event: { body?: unknown }) => event.body ?? {}
globals.createError = ({ statusCode, statusMessage }: { statusCode: number; statusMessage: string }) => {
  return Object.assign(new Error(statusMessage), { statusCode, statusMessage })
}