---
name: openmeerkat
description: OpenMeerkat is an open-source chat marketing platform for managing contacts, conversations, flows, broadcasts, and sequences across WhatsApp, Messenger, Instagram, TikTok, Telegram, Zalo OA, Email, and Webchat. An alternative to ManyChat, Chatfuel, Wati, Respond, etc...
version: 0.1.6
emoji: 🤖
homepage: https://github.com/Reality-Shifting-Tech/OpenMeerkat
metadata:
  openclaw:
    primaryEnv: OPENMEERKAT_API_KEY
    requires:
      env:
        - OPENMEERKAT_API_KEY
        - OPENMEERKAT_API_URL
    envVars:
      - name: OPENMEERKAT_API_KEY
        description: Workspace API token (Settings → Developer → API Keys)
        required: true
      - name: OPENMEERKAT_API_URL
        description: Base URL of your OpenMeerkat instance, e.g. https://app.openmeerkat.com/api
        required: true
      - name: OPENMEERKAT_ALLOW_SELF_SIGNED_CERT
        description: Set to true to disable TLS verification for self-hosted instances
        required: false
    os:
      - macos
      - linux
      - windows
---

# OpenMeerkat Agent Documentation

**OpenMeerkat** is an open-source omnichannel chatbot platform for managing contacts, conversations, flows, broadcasts, and sequences across channels like WhatsApp, Messenger, Telegram, and more.

## Key Highlights

**Two Critical Rules:**

1. Authenticate before executing any commands — every API call requires a workspace token
2. Always resolve IDs first — commands like `contacts tag add` require both a `contactId` and a `tagId`; fetch them with `list` commands before using them

**Integration Modes:**

- **CLI** (`openmeerkat`) — terminal-based automation and scripting
- **MCP Server** — gives AI agents (Claude, Cursor, ChatGPT) direct tool access via Model Context Protocol

---

## Authentication

### CLI

Save credentials once — they persist across all future runs:

```bash
openmeerkat config set --apiKey <your-workspace-token> --apiUrl https://app.openmeerkat.com/api
```

Or via environment variables (no config file needed):

```bash
export OPENMEERKAT_API_KEY=your_workspace_token
export OPENMEERKAT_API_URL=https://app.openmeerkat.com/api
```

For local instances with self-signed certificates:

```bash
export OPENMEERKAT_ALLOW_SELF_SIGNED_CERT=true
```

Find your workspace token at: **Settings → Developer → API Keys**

### MCP Server (stdio — recommended for local use)

```bash
claude mcp add openmeerkat \
  -e OPENMEERKAT_API_KEY=<your-token> \
  -e OPENMEERKAT_API_URL=https://your-instance.com \
  -e OPENMEERKAT_MCP_TRANSPORT=stdio \
  -s user \
  -- node /path/to/dist/index.mjs
```

### MCP Server (SSE — for shared/remote access)

```bash
claude mcp add openmeerkat \
  -t sse \
  -H "x-workspace-token: <your-token>" \
  -s user \
  "https://your-mcp-server.com/sse"
```

---

## Core Workflow

The platform follows a six-step pattern:

1. **Authenticate** — set API key and URL
2. **Discover** — list channels, tags, custom fields, flows, sequences to get IDs
3. **Find contacts** — list or search contacts to get `contactId`
4. **Act** — create, update, tag, message, block/unblock contacts
5. **Monitor** — check conversations, broadcasts, error logs
6. **Automate** — trigger flows or sequences for a contact via messaging commands

---

## CLI Commands

### Config

```bash
openmeerkat config set --apiKey <key> --apiUrl <url>
```

### Workspace & Members

```bash
openmeerkat workspaces get
openmeerkat members list                                # [--page --perPage --sort --keyword]
openmeerkat members get <memberId>
openmeerkat channels list                               # [--includes --page --perPage]
openmeerkat teams list
```

### Tags

```bash
openmeerkat tags list
openmeerkat tags create --name <name>
openmeerkat tags get <idOrName>                         # accepts id or name
openmeerkat tags update <id> --name <name>
openmeerkat tags delete <id>
```

### Custom Fields

```bash
openmeerkat custom-fields list
openmeerkat custom-fields create --name <name> --type <type>
openmeerkat custom-fields get <idOrName>                # accepts id or name
openmeerkat custom-fields update <id> --name <name>     # [--description --folderId]
openmeerkat custom-fields delete <id>
```

### Bot Fields

```bash
openmeerkat bot-fields list
openmeerkat bot-fields create --name <name> --type <type> --value <value> --description <description>
openmeerkat bot-fields update --fields <fields>         # set multiple values
openmeerkat bot-fields get <idOrName>                   # accepts id or name
openmeerkat bot-fields update <idOrName> --value <value> # set single value by id or name
openmeerkat bot-fields delete <idOrName>
```

### Contacts

```bash
# CRUD
openmeerkat contacts list                               # [--page --perPage --sort --keyword ...]
openmeerkat contacts create --phoneNumber <p> --email <e> --gender <g>  # [--firstName --lastName]
openmeerkat contacts get <identifier>
openmeerkat contacts upsert <identifier>                    # insert or update; [--firstName --lastName --email --phoneNumber --avatar --gender]
openmeerkat contacts update <identifier>
openmeerkat contacts delete <identifier>
openmeerkat contacts find-by-custom-field               # [--customFieldId --value]
openmeerkat contacts import --fileId <id> --channel <ch> --inboxId <id>

# Tags on a contact
openmeerkat contacts tags list <identifier>
openmeerkat contacts tag add <identifier> --tagIds <ids>
openmeerkat contacts tag delete <identifier> --tagIds <ids>

# Custom fields on a contact
openmeerkat contacts custom-fields list <identifier>
openmeerkat contacts custom-fields update <identifier> --fields <fields>
openmeerkat contacts custom-field get <identifier> <customFieldId>
openmeerkat contacts custom-field add <identifier> <customFieldId> --value <value>
openmeerkat contacts custom-field delete <identifier> <idOrName>

# Block / Unblock
openmeerkat contacts block <identifier>
openmeerkat contacts unblock <identifier>

# Messaging & Automation
openmeerkat contacts messages list <identifier>          # [--perPage --cursor]
openmeerkat contacts message get <identifier> <messageId>
openmeerkat contacts message send <identifier>           # [--text --files --flowId --nodeId --inboxId]
openmeerkat contacts flow add <identifier> --flowId <id> # [--inboxId]
openmeerkat contacts auto-replies add <identifier> --keyword <kw>  # [--inboxId]
```

### Conversations & Broadcasts

```bash
openmeerkat conversations list                          # [--botCategory --assignedId --channel --status --keyword]
openmeerkat broadcasts list
openmeerkat broadcasts get <idOrName>                   # accepts id or name
openmeerkat broadcasts audience get <idOrName>          # [--page --perPage]
```

### Flows & Sequences

```bash
openmeerkat flows list
openmeerkat sequences list                              # [--page --perPage --sort]
openmeerkat sequences get <id>
```

### Other

```bash
openmeerkat saved-replies list
openmeerkat template-messages list                      # [--inboxId --integrationWhatsappId --status]
openmeerkat ai-agents list
openmeerkat integrations list
openmeerkat keywords list
openmeerkat triggers list
openmeerkat webhooks list
openmeerkat error-logs list                             # [--page --perPage --sort --keyword]
```

---

## MCP Tools (for AI agents)

Tool names are the OpenAPI `operationId` converted to `snake_case`.

| Category              | Tool                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Workspace             | `get_workspace`                                                                                                                                                                |
| Channels              | `list_channels`                                                                                                                                                                |
| Members               | `list_members`, `get_member`                                                                                                                                                   |
| Teams                 | `list_teams`                                                                                                                                                                   |
| Tags                  | `list_tags`, `create_tag`, `get_tag`, `update_tag`, `delete_tag`                                                                                                               |
| Custom Fields         | `list_custom_fields`, `create_custom_field`, `get_custom_field`, `update_custom_field`, `delete_custom_field`                                                                  |
| Bot Fields            | `list_bot_fields`, `create_bot_field`, `set_bot_fields`, `bulk_update_bot_fields`, `get_bot_field`, `set_bot_field`, `delete_bot_fields`                                       |
| Contacts              | `list_contacts`, `create_contact`, `get_contact`, `upsert_contact`, `update_contact`, `delete_contact`, `filter_contacts`, `import_contacts`                                   |
| Contact Tags          | `list_contact_tags`, `add_contact_tags`, `remove_contact_tags`                                                                                                                 |
| Contact Custom Fields | `list_contact_custom_fields`, `set_contact_custom_fields`, `clear_contact_custom_fields`, `get_contact_custom_field`, `set_contact_custom_field`, `clear_contact_custom_field` |
| Contact Actions       | `block_contact`, `unblock_contact`, `list_contact_messages`, `get_contact_message`, `send_message`, `send_contact_flow`, `trigger_auto_reply`                                  |
| Conversations         | `list_conversations`                                                                                                                                                           |
| Broadcasts            | `list_broadcasts`, `get_broadcast`, `get_broadcast_audience`                                                                                                                   |
| Flows                 | `list_flows`                                                                                                                                                                   |
| Sequences             | `list_sequences`, `get_sequence`                                                                                                                                               |
| Saved Replies         | `list_saved_replies`                                                                                                                                                           |
| Template Messages     | `list_template_messages`                                                                                                                                                       |
| AI Agents             | `list_aiagents`                                                                                                                                                                |
| Integrations          | `list_integrations`                                                                                                                                                            |
| Keywords              | `list_keywords`                                                                                                                                                                |
| Triggers              | `list_triggers`                                                                                                                                                                |
| Webhooks              | `list_webhooks`                                                                                                                                                                |
| Error Logs            | `list_error_logs`                                                                                                                                                              |

Tools are auto-generated from the OpenAPI spec — new API endpoints appear automatically on server restart.

---

## Common Patterns

**Tag a contact by name (not ID):**

```bash
TAG_ID=$(openmeerkat tags get "vip" --json | jq -r '.id')
openmeerkat contacts tag add <identifier> --tagIds $TAG_ID
```

**Send a flow to a contact:**

```bash
FLOW_ID=$(openmeerkat flows list --json | jq -r '.[] | select(.name=="Welcome") | .id')
openmeerkat contacts flow add <identifier> --flowId $FLOW_ID
```

**Set a custom field value on a contact:**

```bash
FIELD_ID=$(openmeerkat custom-fields get "plan" --json | jq -r '.id')
openmeerkat contacts custom-field add <identifier> $FIELD_ID --value "premium"
```

---

## Caching

The CLI caches the API spec at `~/.openmeerkat/openapi-cache.json` for 1 hour. Force refresh when new APIs are available:

```bash
openmeerkat --refresh-spec <command>
# or
rm ~/.openmeerkat/openapi-cache.json
```

---

## Getting Help

```bash
openmeerkat --help
openmeerkat contacts --help
openmeerkat contacts message --help
openmeerkat contacts message send --help
```
