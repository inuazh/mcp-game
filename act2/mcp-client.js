// resource-client.js
// Import the MCP SDK modules
import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

async function main() {
  console.log('Initializing MCP test client...')

  // Create and initialize the client
  const client = new Client({
    name: 'resource-client',
    version: '1.0.0',
  })

  // Create a transport to connect to your server
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['./act2/mcp-server.js'],
  })

  await client.connect(transport)
  console.log('Connected to server successfully!\n')

  // List available resources
  const resourcesList = await client.listResources()

  console.log('Available Resources:')
  for (const r of resourcesList.resources) {
    console.log(`- ${r.name} (${r.uri})`)
  }

  console.log('\nResource Templates:')
  for (const t of resourcesList.resourceTemplates) {
    console.log(`- ${t.name} (${t.uriTemplate})`)
  }

  // Read resources
  const readAndPrint = async (uri, title) => {
    const result = await client.readResource({uri})
    console.log(`\n${title}:`)
    console.log('----------------------------------')
    console.log(result.contents[0].text)
  }

  await readAndPrint('news://finance/recent', 'Recent Financial News')
  await readAndPrint('cassandra://prediction/market', 'Market Prediction')
  await readAndPrint('market://historical/AAPL', 'AAPL Historical Data')
  await readAndPrint('market://historical/MSFT', 'MSFT Historical Data')
  await readAndPrint('market://current/AAPL', 'AAPL Current Data')

  // Cleanup
  await client.close()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
