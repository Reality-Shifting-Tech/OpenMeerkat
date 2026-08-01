# OpenMeerkat CLI

CLI for interacting with the OpenMeerkat API.

Commands are automatically generated from the OpenMeerkat public API spec — no manual update needed when new APIs are added.

---

## Installation

```bash
npm install -g openmeerkat
# or
pnpm install -g openmeerkat
```

---

## Setup

### 1. Set API Configuration

Before running any command, save your API key and URL:

```bash
openmeerkat config set --apiKey <yourApiKey> --apiUrl <yourApiUrl>
```

- `--apiKey` — Workspace API key (found in OpenMeerkat Settings → Developer → API Keys)
- `--apiUrl` — Base API URL of your instance, e.g. `https://app.openmeerkat.com/api`

You can also set them individually:

```bash
openmeerkat config set --apiKey <yourApiKey>
openmeerkat config set --apiUrl https://app.openmeerkat.com/api
```

Or via environment variables:

```bash
export OPENMEERKAT_API_KEY=your_api_key
export OPENMEERKAT_API_URL=https://app.openmeerkat.com/api
```

For local dev with a self-signed certificate:

```bash
openmeerkat config set --allowSelfSignedCert true
# or
export OPENMEERKAT_ALLOW_SELF_SIGNED_CERT=true
```

### 2. Global Options

Available on every command:

| Option | Description |
|---|---|
| `--apiKey` | Override API key for this run |
| `--apiUrl` | Override API URL for this run |
| `--allowSelfSignedCert` | Disable TLS cert validation |
| `--refresh-spec` | Force re-fetch the OpenAPI spec (clears cache) |

---

## Commands

### `config`

```bash
openmeerkat config set --apiKey <key> --apiUrl <url>
```

---

### `workspaces`

```bash
openmeerkat workspaces get                              # Get workspace info
```

---

### `members`

```bash
openmeerkat members list                                # List workspace members
                                                     # [--page --perPage --sort --keyword]
openmeerkat members get <memberId>                      # Get workspace member by id
```

---

### `channels`

```bash
openmeerkat channels list                               # List channels
                                                     # [--includes --page --perPage]
```

---

### `teams`

```bash
openmeerkat teams list                                  # List teams
```

---

### `tags`

```bash
openmeerkat tags list                                   # Get all tags
openmeerkat tags create --name <name>                   # Create a new tag
openmeerkat tags get <idOrName>                         # Get tag by id or name
openmeerkat tags update <id> --name <name>              # Update tag
openmeerkat tags delete <id>                            # Delete tag
```

---

### `custom-fields`

```bash
openmeerkat custom-fields list                          # Get all custom fields
openmeerkat custom-fields create --name <name> --type <type>
openmeerkat custom-fields get <idOrName>                # Get custom field by id or name
openmeerkat custom-fields update <id> --name <name>     # [--description --folderId]
openmeerkat custom-fields delete <id>
```

---

### `bot-fields`

```bash
openmeerkat bot-fields list                             # Get all bot fields
openmeerkat bot-fields create --name <name> --type <type> --value <value> --description <description>
                                                     # [--folderId]
openmeerkat bot-fields update --fields <fields>         # Set multiple bot field values
openmeerkat bot-fields bulk-update --fields <fields>    # Bulk update values by id or name
                                                     # fields: JSON array of {id,value} or {name,value}
openmeerkat bot-fields get <idOrName>                   # Get bot field by id or name
openmeerkat bot-fields update <idOrName> --value <value> # Set bot field value by id or name
openmeerkat bot-fields delete <idOrName>                # Unset bot field value
```

---

### `contacts`

The `<identifier>` parameter supports three formats:

| Format | Example | Lookup by |
|--------|---------|-----------|
| `id:<value>` | `id:123456789` | Contact ID |
| `email:<value>` | `email:user@example.com` | Email address |
| `phone:<value>` | `phone:+84708123123` | Phone number |

```bash
# Basic CRUD
openmeerkat contacts list                               # [--page --perPage --sort --keyword ...]
openmeerkat contacts create --phoneNumber <phoneNumber> --email <email> --gender <gender>
                                                     # [--firstName --lastName]
openmeerkat contacts get <identifier>
openmeerkat contacts upsert <identifier>                    # Insert or update by identifier
                                                     # [--firstName --lastName --email --phoneNumber --avatar --gender]
openmeerkat contacts update <identifier>
openmeerkat contacts delete <identifier>
openmeerkat contacts find-by-custom-field               # [--customFieldId --value]
openmeerkat contacts import --fileId <fileId> --channel <channel> --inboxId <inboxId>
                                                     # [--countryCode --phoneNumber --fieldMapping ...]

# Tags
openmeerkat contacts tags list <identifier>             # Get all tags on a contact
openmeerkat contacts tag add <identifier> --tagIds <tagIds>
openmeerkat contacts tag delete <identifier> --tagIds <tagIds>

# Custom fields
openmeerkat contacts custom-fields list <identifier>    # Get all custom fields from a contact
openmeerkat contacts custom-fields update <identifier> --fields <fields>  # Set multiple values
openmeerkat contacts custom-field get <identifier> <customFieldId>
openmeerkat contacts custom-field add <identifier> <customFieldId> --value <value>
openmeerkat contacts custom-field delete <identifier> <idOrName>  # Delete by id or name

# Block / Unblock
openmeerkat contacts block <identifier>
openmeerkat contacts unblock <identifier>

# Messaging & Automation
openmeerkat contacts messages list <identifier>         # [--perPage --cursor]
openmeerkat contacts message get <identifier> <messageId>  # Get a message by ID for a contact
openmeerkat contacts message send <identifier>          # [--text --files --flowId --nodeId --inboxId]
openmeerkat contacts flow add <identifier> --flowId <flowId>  # [--inboxId]
openmeerkat contacts auto-replies add <identifier> --keyword <keyword>  # [--inboxId]
```

---

### `conversations`

```bash
openmeerkat conversations list                          # [--botCategory --assignedId --channel --status
                                                     #  --keyword --botEnabled --cursor --perPage --sort]
```

---

### `broadcasts`

```bash
openmeerkat broadcasts list
openmeerkat broadcasts get <idOrName>                   # Get broadcast by id or name
openmeerkat broadcasts audience get <idOrName>          # Get broadcast audience (contacts)
                                                     # [--page --perPage]
```

---

### `flows`

```bash
openmeerkat flows list
```

---

### `sequences`

```bash
openmeerkat sequences list                              # [--page --perPage --sort]
openmeerkat sequences get <id>
```

---

### `saved-replies`

```bash
openmeerkat saved-replies list
```

---

### `template-messages`

```bash
openmeerkat template-messages list                      # [--inboxId --integrationWhatsappId --status]
```

---

### `ai-agents`

```bash
openmeerkat ai-agents list
```

---

### `integrations`

```bash
openmeerkat integrations list
```

---

### `keywords`

```bash
openmeerkat keywords list                               # List keywords (automated responses)
```

---

### `triggers`

```bash
openmeerkat triggers list
```

---

### `webhooks`

```bash
openmeerkat webhooks list
```

---

### `error-logs`

```bash
openmeerkat error-logs list                             # [--page --perPage --sort --keyword]
```

---

## Caching

The CLI caches the API spec at `~/.openmeerkat/openapi-cache.json` for 1 hour to avoid fetching on every run.

```bash
# Force refresh the spec cache
openmeerkat --refresh-spec <command>

# Or delete the cache manually
rm ~/.openmeerkat/openapi-cache.json
```

Cache TTL can be overridden via environment variable:

```bash
OPENMEERKAT_SPEC_CACHE_TTL_SECONDS=300 openmeerkat tags list
```

---

## Getting Help

```bash
openmeerkat --help                          # List all command groups
openmeerkat contacts --help                 # List actions for a group
openmeerkat contacts message --help         # List subactions
openmeerkat contacts message send --help    # Show options for a specific action
```
