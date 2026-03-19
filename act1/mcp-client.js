import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

const client = new Client({
  name: 'disrupt-client',
  version: '0.1.0',
})

const transport = new StdioClientTransport({
  command: 'node',
  args: ['./act1/mcp-server.js'],
})

async function main() {
  try {
    await client.connect(transport)

    console.log('Connected to server successfully!')
  } catch (error) {
    console.error('Failed to connect:', error)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unrecoverable error:', err)
})
