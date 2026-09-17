"use client";

import { defineConfig, type WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

/**
 * Studio er indlejret på horizen.dk/admin, som på kundesiterne.
 *
 * To arbejdsområder mod samme projekt:
 *  - live:      det horizen.dk viser. Udgivelse her rammer sitet.
 *  - udvikling: sandkasse. Ses kun på den lokale udviklingsserver.
 */
function workspace(dataset: "production" | "development", title: string): WorkspaceOptions {
  return {
    name: dataset,
    title,
    basePath: `/admin/${dataset}`,
    projectId,
    dataset,
    plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
    schema: { types: schemaTypes },
  };
}

export default defineConfig([
  workspace("production", "Horizen · live"),
  workspace("development", "Horizen · udvikling"),
]);
