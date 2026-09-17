import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "h8zzgfds",
    dataset: "development",
  },
  // Hostes hos Sanity på https://horizen.sanity.studio (horizen.dk/admin viderestiller hertil).
  studioHost: "horizen",
  deployment: {
    appId: "m2t0asgbp4v9d6684tv3sozv",
    autoUpdates: true,
  },
});
