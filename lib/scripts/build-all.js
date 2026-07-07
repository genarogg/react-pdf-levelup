import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const libs = [
    "client",
    "qr",
    "chart",
    "core",
    "icons",
    "studio"
];
const basePath = process.cwd();

(async () => {
    for (const lib of libs) {
        const libPath = path.join(basePath, lib);
        console.log(`\nProcessing ${lib}...`);

        if (!fs.existsSync(libPath)) {
            console.warn(`Library directory ${lib} not found at ${libPath}. Skipping.`);
            continue;
        }

        try {
            // Build
            console.log(`[${lib}] Building...`);
            execSync("npm run build:lib", { cwd: libPath, stdio: "inherit" });

            console.log(`[${lib}] Successfully built.`);
        } catch (error) {
            console.error(`[${lib}] Failed to build:`, error);
            process.exit(1);
        }
    }
    console.log("\nAll libraries built successfully.");
})();