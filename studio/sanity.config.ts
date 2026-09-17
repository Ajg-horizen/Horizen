import { defineConfig, type WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = "h8zzgfds";

/**
 * To arbejdsområder mod samme projekt:
 *  - udvikling: her bygges og testes. Lokalt site læser herfra.
 *  - live:      det horizen.dk viser. Røres kun bevidst.
 */
function workspace(dataset: "development" | "production", title: string): WorkspaceOptions {
  return {
    name: dataset,
    title,
    basePath: `/${dataset}`,
    projectId,
    dataset,
    plugins: [structureTool(), visionTool({ defaultApiVersion: "2025-02-19" })],
    schema: { types: schemaTypes },
  };
}

export default defineConfig([
  workspace("development", "Horizen · udvikling"),
  workspace("production", "Horizen · live"),
]);
