import fs from "fs";
import path from "path";
import buildLib from "./buildLib.js";
import libs from "../NameLibs.js"

const basePath = process.cwd();

(async () => {
    for (const lib of libs) {
        const libPath = path.join(basePath, "mod", lib);
        console.log(`\nProcessing ${lib}...`);

        if (!fs.existsSync(libPath)) {
            console.warn(`Library directory ${lib} not found at ${libPath}. Skipping.`);
            continue;
        }

        try {
            // Build (con poda temporal de los barrels reales)
            console.log(`[${lib}] Building...`);
            await buildLib(lib, libPath, basePath);

            console.log(`[${lib}] Successfully built.`);
        } catch (error) {
            console.error(`[${lib}] Failed to build:`, error);
            process.exit(1);
        }
    }
    console.log("\nAll libraries built successfully.");
})();