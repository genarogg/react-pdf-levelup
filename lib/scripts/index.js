import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import updateTsconfig from "./updateTsconfig.js";
import upVersion from "./upVersion.js";
import eliminarDependencias from "./eliminarDependencias.js"


const libs = ["client", "qr", "chart", "core", "icons"];
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
            // 1. Update tsconfig
            console.log(`[${lib}] Updating tsconfig...`);
            updateTsconfig(libPath);

            // 2. Update version
            console.log(`[${lib}] Updating version...`);
            upVersion(libPath);

            // 3. Build
            console.log(`[${lib}] Building...`);
            // Ensure dependencies are installed? Assuming they are since user is working on it.
            execSync("npm run build:lib", { cwd: libPath, stdio: "inherit" });

            // 4. Publish (Clean deps -> Publish -> Restore)
            console.log(`[${lib}] Publishing...`);

            let depsToKeep = [];
            if (lib === 'core') {
                depsToKeep = [
                    "react",
                    "react-dom",
                    "react-pdf",
                    "@react-pdf/renderer"
                ];
            }
            if (lib === 'qr') {
                depsToKeep = [
                    "canvas",
                    "jsdom",
                    "qrcode",
                    "qr-code-styling",
                    "@react-pdf-levelup/core"
                ];
            }
            if (lib === 'client') {
                depsToKeep = [];
            }

            if (lib === 'icons') {
                depsToKeep = [
                    "lucide",
                    "@react-pdf-levelup/core"
                ];
            }


            eliminarDependencias(libPath, depsToKeep);

            console.log(`[${lib}] Successfully processed.`);
        } catch (error) {
            console.error(`[${lib}] Failed to process:`, error);
            process.exit(1);
        }
    }
    console.log("\nAll libraries processed successfully.");
})();
