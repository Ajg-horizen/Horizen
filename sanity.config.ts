"use client";

import { defineConfig, type WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { StudioLayout } from "@/sanity/ui/StudioLayout";

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
    // efter login sendes man tilbage til SEO-dashboardet, hvis man kom derfra
    studio: { components: { layout: StudioLayout } },
  };
}

export default defineConfig([
  workspace("production", "Horizen · live"),
  workspace("development", "Horizen · udvikling"),
]);
