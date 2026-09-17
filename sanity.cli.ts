import { defineCliConfig } from "sanity/cli";

// Bruges kun af Sanity CLI (fx `npx sanity documents validate`). Studio selv
// kører indlejret i sitet på /admin og deployes sammen med det.
export default defineCliConfig({
  api: {
    projectId: "4555ww0t",
    dataset: "development",
  },
});
