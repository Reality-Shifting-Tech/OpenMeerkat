# OpenMeerkat MCP Server

[Model Context Protocol](https://modelcontextprotocol.io) server for OpenMeerkat. Gives AI agents (Claude, Cursor, ChatGPT, etc.) access to your OpenMeerkat workspace through tools that are **automatically generated** from the OpenMeerkat OpenAPI spec — no manual tool definitions needed.

## How it works

On startup the server fetches `{OPENMEERKAT_API_URL}/api/public-spec.json` and registers one MCP tool per API operation. Adding a new API endpoint in OpenMeerkat automatically makes it available as a tool on the next server restart — no code changes required.

## Available tools

Tool names are derived from the OpenAPI `operationId` converted to `snake_case`. The current set of tools:

### Workspace

| Tool | Description |
|---|---|
| `get_workspace` | Get workspace |

### Channels

| Tool | Description |
|---|---|
| `list_channels` | List channels |

### Members

| Tool | Description |
|---|---|
| `list_members` | List workspace members |
| `get_member` | Get workspace member by id |

### Teams

| Tool | Description |
|---|---|
| `list_teams` | List teams |

### Tags

| Tool | Description |
|---|---|
| `list_tags` | Get all tags |
| `create_tag` | Create a new tag |
| `get_tag` | Get tag by id or name |
| `update_tag` | Update tag |
| `delete_tag` | Delete tag |

### Custom Fields

| Tool | Description |
|---|---|
| `list_custom_fields` | Get all custom fields |
| `create_custom_field` | Create a custom field |
| `get_custom_field` | Get custom field by id or name |
| `update_custom_field` | Update custom field |
| `delete_custom_field` | Delete custom field |

### Bot Fields

| Tool | Description |
|---|---|
| `list_bot_fields` | Get all bot fields |
| `create_bot_field` | Create a new bot field |
| `set_bot_fields` | Set multiple bot field values |
| `bulk_update_bot_fields` | Bulk update bot field values by id or name |
| `get_bot_field` | Get bot field by id or name |
| `set_bot_field` | Set bot field value by id or name |
| `delete_bot_fields` | Unset the value of the bot field by id or name |

### Contacts

| Tool | Description |
|---|---|
| `list_contacts` | List contacts |
| `create_contact` | Create a contact |
| `get_contact` | Get contact by contact id |
| `upsert_contact` | Upsert a contact by identifier (insert if not found, update if found) |
| `update_contact` | Update contact fields |
| `delete_contact` | Delete a contact |
| `filter_contacts` | List contacts by custom field |
| `import_contacts` | Import contacts from a file |
| `list_contact_tags` | Get all tags added to this contact |
| `add_contact_tags` | Add tags to the contact |
| `remove_contact_tags` | Remove tags from the contact |
| `list_contact_custom_fields` | Get all custom fields from a contact |
| `set_contact_custom_fields` | Set multiple custom field values for a contact |
| `clear_contact_custom_fields` | Clear all custom fields from a contact |
| `get_contact_custom_field` | Get contact custom field value |
| `set_contact_custom_field` | Set contact custom field value |
| `clear_contact_custom_field` | Delete contact custom field by id or name |
| `block_contact` | Block a contact |
| `unblock_contact` | Unblock a contact |
| `list_contact_messages` | List messages for contact |
| `get_contact_message` | Get a message by ID for a contact |
| `send_message` | Send message to contact |
| `send_contact_flow` | Send flow to contact |
| `trigger_auto_reply` | Trigger auto reply for contact |

### Conversations

| Tool | Description |
|---|---|
| `list_conversations` | List conversations |

### Broadcasts

| Tool | Description |
|---|---|
| `list_broadcasts` | Get all broadcasts |
| `get_broadcast` | Get broadcast by id or name |
| `get_broadcast_audience` | Get broadcast audience (contacts with delivery status) |

### Flows

| Tool | Description |
|---|---|
| `list_flows` | Get all flows |

### Sequences

| Tool | Description |
|---|---|
| `list_sequences` | List sequences |
| `get_sequence` | Get sequence details |

### Saved Replies

| Tool | Description |
|---|---|
| `list_saved_replies` | List saved replies |

### Template Messages

| Tool | Description |
|---|---|
| `list_template_messages` | List template messages |

### AI Agents

| Tool | Description |
|---|---|
| `list_aiagents` | List AI agents |

### Integrations

| Tool | Description |
|---|---|
| `list_integrations` | List integrations |

### Keywords

| Tool | Description |
|---|---|
| `list_keywords` | List keywords (automated responses) |

### Triggers

| Tool | Description |
|---|---|
| `list_triggers` | List triggers |

### Webhooks

| Tool | Description |
|---|---|
| `list_webhooks` | List webhooks |

### Error Logs

| Tool | Description |
|---|---|
| `list_error_logs` | List error logs |

## Prerequisites

- Node.js >= 18
- A OpenMeerkat workspace token (`Settings → Developer → API Keys`)

## Quick start

### Option A — stdio (recommended for local use)

Claude spawns the server process on demand. No server needs to be running. The workspace token is supplied via `OPENMEERKAT_API_KEY`.

**Claude Code CLI:**
```bash
claude mcp add openmeerkat \
  -e OPENMEERKAT_API_KEY=<your-token> \
  -e OPENMEERKAT_API_URL=https://your-instance.com \
  -e OPENMEERKAT_MCP_TRANSPORT=stdio \
  -s user \
  -- node /path/to/dist/index.mjs
```

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "openmeerkat": {
      "command": "node",
      "args": ["/path/to/dist/index.mjs"],
      "env": {
        "OPENMEERKAT_API_KEY": "<your-token>",
        "OPENMEERKAT_API_URL": "https://your-instance.com",
        "OPENMEERKAT_MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

### Option B — SSE (for shared / remote access)

Run the server once and multiple clients connect via URL. Pass the workspace token in the request header.

```bash
# Start the server
pnpm start

# Add to Claude Code CLI
claude mcp add openmeerkat \
  -t sse \
  -H "x-workspace-token: <your-token>" \
  -s user \
  "https://your-mcp-server.com/sse"
```

**Claude Desktop:**
```json
{
  "mcpServers": {
    "openmeerkat": {
      "type": "sse",
      "url": "https://your-mcp-server.com/sse",
      "headers": {
        "x-workspace-token": "<your-token>"
      }
    }
  }
}
```

### Option C — ChatGPT.com (remote SSE)

ChatGPT.com connects via SSE. The server must be publicly reachable. Because ChatGPT does not support custom request headers, pass the workspace token directly in the URL:

1. Start the server with `OPENMEERKAT_MCP_TRANSPORT=sse` (or `both`).
2. In ChatGPT Settings → Connectors → Add custom connector, set the URL:
   ```
   https://your-mcp-server.com/sse?workspace_token=<your-token>
   ```
   When using this URL in a shell command, always quote it to prevent `?` being interpreted as a glob:
   ```bash
   claude mcp add openmeerkat -t sse -s user "https://your-mcp-server.com/sse?workspace_token=<your-token>"
   ```
3. Set `OPENMEERKAT_MCP_SERVER_INSTRUCTIONS` so ChatGPT uses tools instead of its training data (see `.env.example` for the recommended value).

## Token resolution order

| Transport | Priority |
|-----------|----------|
| SSE / Streamable HTTP | `?workspace_token=` or `?token=` query param → `x-workspace-token` / `x-chatbo-token` header → `OPENMEERKAT_API_KEY` env |
| stdio | `OPENMEERKAT_API_KEY` env |

## Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Default | Required |
|---|---|---|---|
| `OPENMEERKAT_API_KEY` | Workspace token (stdio) | — | Yes (stdio) |
| `OPENMEERKAT_API_URL` | OpenMeerkat instance URL | `https://api.openmeerkat.com` | Yes |
| `OPENMEERKAT_ALLOW_SELF_SIGNED_CERT` | Disable TLS verification (`true`/`false`) | — | No |
| `OPENMEERKAT_MCP_TRANSPORT` | `stdio` \| `sse` \| `both` | `both` | No |
| `OPENMEERKAT_MCP_HOST` | SSE server host | `0.0.0.0` | No |
| `OPENMEERKAT_MCP_PORT` | SSE server port | `3333` | No |
| `OPENMEERKAT_MCP_SSE_PATH` | SSE endpoint path | `/sse` | No |
| `OPENMEERKAT_MCP_MESSAGES_PATH` | JSON-RPC messages path | `/messages` | No |
| `OPENMEERKAT_MCP_SERVER_NAME` | Display name sent to AI clients | package name | No |
| `OPENMEERKAT_MCP_SERVER_INSTRUCTIONS` | Instructions sent to AI clients on connect (helps ChatGPT know when to call tools) | built-in default | No |

## Scripts

```bash
# Development with watch mode
pnpm dev:mcp

# Build for production
pnpm build

# Run built server
pnpm start

# Type check
pnpm check-types

# List loaded tools (requires OPENMEERKAT_API_URL and OPENMEERKAT_API_KEY in .env)
dotenv -e .env -- tsx src/test-tools.ts
```

## Project structure

```
src/
├── index.ts              # Entry point — loads spec, starts transport(s)
├── env.ts                # Environment variable schema
├── openapi-loader.ts     # Fetches OpenAPI spec → DynamicTool list
├── test-tools.ts         # Dev utility — prints loaded tools
└── server/
    ├── create-mcp-server.ts   # MCP server factory
    ├── sse-server.ts          # SSE / Streamable HTTP transport
    └── stdio-server.ts        # stdio transport
```

## Troubleshooting

**Tools not showing up**
- Check that `OPENMEERKAT_API_URL` is reachable and `{OPENMEERKAT_API_URL}/api/public-spec.json` returns a valid OpenAPI spec.
- Check stderr output on startup — the server logs `Loaded N tools from OpenAPI spec`.

**Port already in use**
```bash
lsof -ti:3333 | xargs kill -9
```

**Self-signed certificate errors**
```bash
OPENMEERKAT_ALLOW_SELF_SIGNED_CERT=true
```

**SSE connection fails in Claude**
- Prefer stdio mode for local use — it has no network dependency.
- For SSE, verify the server is running and the URL/port are reachable from the client.

**ChatGPT uses its training knowledge instead of calling tools**
- Set `OPENMEERKAT_MCP_SERVER_INSTRUCTIONS` to explicitly instruct ChatGPT to use tools (see `.env.example`).
- Make sure the connector URL includes `?workspace_token=<your-token>` so authentication is handled automatically.
