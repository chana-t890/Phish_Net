import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime'

/**
 * Bedrock runtime client factory
 * Creates and caches a BedrockRuntimeClient for AWS Claude model invocation
 */

let bedrockClient: BedrockRuntimeClient | undefined

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  }
}

function getBedrockClient(): BedrockRuntimeClient {
  if (!bedrockClient) {
    const config = useRuntimeConfig()

    if (!config.awsRegion) {
      throw new Error('Missing required config: awsRegion')
    }
    if (!config.bedrockModelId) {
      throw new Error('Missing required config: bedrockModelId')
    }

    // In dev, the Nitro worker process may not inherit AWS_PROFILE from .env
    // even though Nuxt captured it into runtimeConfig. Re-export it so the AWS
    // SDK's default credential provider chain can resolve the SSO profile.
    if (config.awsProfile && !process.env.AWS_PROFILE) {
      process.env.AWS_PROFILE = config.awsProfile as string
    }

    // No explicit credentials — AWS SDK resolves them via the default credential
    // provider chain: SSO session → env vars → ~/.aws/credentials → IAM role
    bedrockClient = new BedrockRuntimeClient({
      region: config.awsRegion,
    })
  }

  return bedrockClient
}

/**
 * Invoke Claude model with synchronous response
 * @param messages Array of messages in Anthropic format
 * @param systemPrompt Optional system prompt for model behavior
 * @param maxTokens Maximum tokens in response (default 2048)
 * @param temperature Sampling temperature 0.0-1.0 (default 1.0)
 * @returns Full text response from model
 */
export async function invokeModel(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  {
    systemPrompt,
    maxTokens = 2048,
    temperature = 1.0,
    timeoutMs = 60_000,
  }: {
    systemPrompt?: string
    maxTokens?: number
    temperature?: number
    timeoutMs?: number
  } = {}
): Promise<string> {
  const config = useRuntimeConfig()
  const client = getBedrockClient()

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    ...(systemPrompt && { system: systemPrompt }),
    messages,
  }

  const timeout = createTimeoutSignal(timeoutMs)

  try {
    const command = new InvokeModelCommand({
      modelId: config.bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    const response = await client.send(command, { abortSignal: timeout.signal })

    // Decode response body
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    // Extract text from content blocks
    const textContent = responseBody.content?.find((block: any) => block.type === 'text')
    if (!textContent?.text) {
      throw new Error('No text content in Bedrock response')
    }

    return textContent.text
  } catch (error) {
    console.error('Bedrock invokeModel error:', error)
    const message = timeout.signal.aborted
      ? `timed out after ${timeoutMs}ms`
      : error instanceof Error
        ? error.message
        : String(error)
    throw new Error(`Bedrock model invocation failed: ${message}`)
  } finally {
    timeout.clear()
  }
}

/**
 * Invoke Claude model with streaming response
 * @param messages Array of messages in Anthropic format
 * @param systemPrompt Optional system prompt for model behavior
 * @param maxTokens Maximum tokens in response (default 2048)
 * @param temperature Sampling temperature 0.0-1.0 (default 1.0)
 * @returns AsyncGenerator yielding text chunks as they arrive
 */
export async function* invokeModelStream(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  {
    systemPrompt,
    maxTokens = 2048,
    temperature = 1.0,
    timeoutMs = 45_000,
  }: {
    systemPrompt?: string
    maxTokens?: number
    temperature?: number
    timeoutMs?: number
  } = {}
): AsyncGenerator<string, void, unknown> {
  const config = useRuntimeConfig()
  const client = getBedrockClient()

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    ...(systemPrompt && { system: systemPrompt }),
    messages,
  }

  const timeout = createTimeoutSignal(timeoutMs)

  try {
    const command = new InvokeModelWithResponseStreamCommand({
      modelId: config.bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    const response = await client.send(command, { abortSignal: timeout.signal })

    // Iterate over response stream events
    if (!response.body) {
      throw new Error('No response body from Bedrock stream')
    }

    for await (const event of response.body) {
      if (event.chunk?.bytes) {
        const eventData = JSON.parse(new TextDecoder().decode(event.chunk.bytes))

        // Emit only text delta events
        if (eventData.type === 'content_block_delta' && eventData.delta?.type === 'text_delta') {
          yield eventData.delta.text
        }
      }
    }
  } catch (error) {
    console.error('Bedrock invokeModelStream error:', error)
    const message = timeout.signal.aborted
      ? `timed out after ${timeoutMs}ms`
      : error instanceof Error
        ? error.message
        : String(error)
    throw new Error(
      `Bedrock model stream invocation failed: ${message}`
    )
  } finally {
    timeout.clear()
  }
}
