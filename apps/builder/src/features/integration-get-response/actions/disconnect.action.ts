"use server"

import { integrationGetResponseService } from "@openmeerkat/business"
import { createDisconnectAction } from "@/lib/integration-actions"

export const disconnectGetResponseAction = createDisconnectAction(
  integrationGetResponseService,
  { name: "GetResponse" },
)
