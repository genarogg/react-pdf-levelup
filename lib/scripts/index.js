import updateTsconfig from "./updateTsconfig.js";
import upVersion from "./upVersion.js";
import eliminarDependencias from "./eliminarDependencias.js";

(async () => {
  updateTsconfig();
  upVersion();
  eliminarDependencias();
})();
