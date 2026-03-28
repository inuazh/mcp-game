// resource-server.js
// Import the MCP SDK modules
import {Server} from '@modelcontextprotocol/sdk/server/index.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

// Sample market data and news content - already implemented for you
const marketData = {
  AAPL: {
    historical: '2023-01: 150.25\n2023-02: 155.74\n2023-03: 160.01\n',
    current:
      'Current Price: 163.77\nVolume: 47.8M\nP/E Ratio: 27.5\n',
  },
  MSFT: {
    historical: '2023-01: 240.35\n2023-02: 255.78\n2023-03: 275.23\n',
    current:
      'Current Price: 290.36\nVolume: 30.2M\nP/E Ratio: 32.1\n',
  },
}

const recentNews = `
FINANCIAL TIMES - Market volatility ahead, analysts warn
BLOOMBERG - Tech sector braces for potential correction
WSJ - Federal Reserve signals interest rate changes
`

const marketPrediction = `
CASSANDRA PROTOCOL - PREDICTION ANALYSIS
========================================
Market Trend: DOWNWARD
Confidence: HIGH (83.7%)
Estimated S&P 500 movement: -15.3% in next 48 hours
Warning: MAJOR MARKET CORRECTION IMMINENT
========================================
`

// Create an MCP server with resources capability
const server = new Server(
  {
    name: 'resource-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
    },
  }
)

// Implement handler for resources/list requests
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'news://finance/recent',
        name: 'Recent Financial News',
      },
      {
        uri: 'cassandra://prediction/market',
        name: 'Market Prediction',
      },
    ],
    resourceTemplates: [
      {
        uriTemplate: 'market://historical/{symbol}',
        name: 'Historical Market Data',
      },
      {
        uriTemplate: 'market://current/{symbol}',
        name: 'Current Market Data',
      },
    ],
  }
})

// Implement handler for resources/read requests
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri

  // news://finance/recent
  if (uri === 'news://finance/recent') {
    return {
      contents: [
        {
          uri,
          text: recentNews.trim(),
          mimeType: 'text/plain',
        },
      ],
    }
  }

  // cassandra://prediction/market
  if (uri === 'cassandra://prediction/market') {
    return {
      contents: [
        {
          uri,
          text: marketPrediction.trim(),
          mimeType: 'text/plain',
        },
      ],
    }
  }

  // market://historical/{symbol}
  const historicalMatch = uri.match(/^market:\/\/historical\/(.+)$/)
  if (historicalMatch) {
    const symbol = historicalMatch[1]
    const data = marketData[symbol]
    if (!data) throw new Error(`Unknown symbol: ${symbol}`)
    return {
      contents: [
        {
          uri,
          text: data.historical.trim(),
          mimeType: 'text/plain',
        },
      ],
    }
  }

  // market://current/{symbol}
  const currentMatch = uri.match(/^market:\/\/current\/(.+)$/)
  if (currentMatch) {
    const symbol = currentMatch[1]
    const data = marketData[symbol]
    if (!data) throw new Error(`Unknown symbol: ${symbol}`)
    return {
      contents: [
        {
          uri,
          text: data.current.trim(),
          mimeType: 'text/plain',
        },
      ],
    }
  }

  throw new Error(`Unknown resource: ${uri}`)
})

// Initialize and start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error('[SERVER] Error:', err)
  process.exit(1)
})
