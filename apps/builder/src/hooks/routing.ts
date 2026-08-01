"use client"

import { getIdFromParams } from "@openmeerkat/utils"
import { useParams } from "next/navigation"

export const useWorkspaceId = () =>
  getIdFromParams(useParams<{ workspaceId: string }>(), "workspaceId")
