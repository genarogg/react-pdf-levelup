import fs from "fs";
import path from "path";

const parseImportLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed.startsWith("import ")) return null;

  const defaultMatch = trimmed.match(/^import\s+(\w+)\s+from\s+["'](.+)["'];?$/);
  if (defaultMatch) {
    return {
      type: "default",
      symbols: [defaultMatch[1]],
      module: defaultMatch[2],
    };
  }

  const namedMatch = trimmed.match(/^import\s+\{([^}]+)\}\s+from\s+["'](.+)["'];?$/);
  if (namedMatch) {
    const symbols = namedMatch[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      type: "named",
      symbols,
      module: namedMatch[2],
    };
  }

  const bothMatch = trimmed.match(/^import\s+(\w+)\s*,\s*\{([^}]+)\}\s+from\s+["'](.+)["'];?$/);
  if (bothMatch) {
    const namedSymbols = bothMatch[2]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      type: "both",
      defaultSymbol: bothMatch[1],
      symbols: [bothMatch[1], ...namedSymbols],
      module: bothMatch[3],
    };
  }

  return null;
};

const findAllImports = (lines) => {
  const found = [];
  let inBlock = false;
  let buffer = "";
  let blockStart = -1;

  const flush = (start, end, rawBuffer) => {
    const flat = rawBuffer.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    const parsed = parseImportLine(flat);
    if (parsed) {
      found.push({ ...parsed, start, end });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!inBlock) {
      if (trimmed.startsWith("import ")) {
        if (trimmed.match(/from\s+["'][^"']+["'];?$/)) {
          flush(i, i, trimmed);
        } else {
          inBlock = true;
          buffer = lines[i];
          blockStart = i;
        }
      }
    } else {
      buffer += "\n" + lines[i];
      if (trimmed.match(/from\s+["'][^"']+["'];?$/)) {
        flush(blockStart, i, buffer);
        inBlock = false;
        buffer = "";
        blockStart = -1;
      }
    }
  }

  return found;
};

const findExportBlock = (lines) => {
  let startIdx = -1;
  let endIdx = -1;
  let depth = 0;
  let foundStart = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === "{") {
        if (!foundStart && line.substring(0, j).trim().startsWith("export")) {
          startIdx = i;
          foundStart = true;
        }
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0 && foundStart) {
          endIdx = i;
          return { startIdx, endIdx };
        }
      }
    }
  }
  return { startIdx, endIdx };
};

const extractExportSymbols = (lines, startIdx, endIdx) => {
  let block = "";
  for (let i = startIdx; i <= endIdx; i++) {
    block += lines[i] + "\n";
  }
  const match = block.match(/export\s*\{([^}]+)\}/s);
  if (!match) return [];
  const inner = match[1];
  return inner
    .split(/[\n,]/)
    .map((s) => s.replace(/\/\/.*$/, "").trim())
    .filter((s) => s && /^[a-zA-Z_$][\w$]*$/.test(s));
};

const rebuildImport = (imp, keepSet) => {
  if (imp.type === "default") {
    return keepSet.has(imp.symbols[0]) ? `import ${imp.symbols[0]} from "${imp.module}"` : null;
  }
  if (imp.type === "named") {
    const keep = imp.symbols.filter((s) => keepSet.has(s));
    return keep.length > 0 ? `import { ${keep.join(", ")} } from "${imp.module}"` : null;
  }
  if (imp.type === "both") {
    const keepDefault = keepSet.has(imp.defaultSymbol);
    const keepNamed = imp.symbols
      .filter((s) => s !== imp.defaultSymbol)
      .filter((s) => keepSet.has(s));
    if (keepDefault && keepNamed.length > 0) {
      return `import ${imp.defaultSymbol}, { ${keepNamed.join(", ")} } from "${imp.module}"`;
    }
    if (keepDefault) {
      return `import ${imp.defaultSymbol} from "${imp.module}"`;
    }
    if (keepNamed.length > 0) {
      return `import { ${keepNamed.join(", ")} } from "${imp.module}"`;
    }
    return null;
  }
  return null;
};

const rebuildExportBlock = (allSymbols, keepSet) => {
  const keep = allSymbols.filter((s) => keepSet.has(s));
  const out = ["export {"];
  const rows = [];
  for (let i = 0; i < keep.length; i += 3) {
    rows.push("  " + keep.slice(i, i + 3).join(", "));
  }
  out.push(rows.join(",\n"));
  out.push("}");
  return out;
};

const cleanBarrelFile = async (
  barrelFilePath,
  exportsToKeep,
  buildCallback
) => {
  const backupPath = barrelFilePath + ".bak";
  const keepSet = new Set(exportsToKeep);

  if (!fs.existsSync(barrelFilePath)) {
    throw new Error(`Barrel file not found: ${barrelFilePath}`);
  }

  fs.copyFileSync(barrelFilePath, backupPath);

  try {
    const originalContent = fs.readFileSync(barrelFilePath, "utf8");
    const lines = originalContent.split(/\r?\n/);

    const imports = findAllImports(lines);
    if (imports.length === 0) {
      throw new Error("No imports found in barrel file");
    }

    const { startIdx, endIdx } = findExportBlock(lines);
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Export block not found in barrel file");
    }

    const allExportSymbols = extractExportSymbols(lines, startIdx, endIdx);

    const importLinesToRemove = new Set();
    for (const imp of imports) {
      for (let i = imp.start; i <= imp.end; i++) {
        importLinesToRemove.add(i);
      }
    }

    const rebuiltImports = [];
    for (const imp of imports) {
      const rebuilt = rebuildImport(imp, keepSet);
      if (rebuilt) rebuiltImports.push(rebuilt);
    }

    const newLines = [];
    let firstImportLine = Math.min(...imports.map((i) => i.start));
    let lastImportLine = Math.max(...imports.map((i) => i.end));
    let insertImportsHere = true;

    for (let i = 0; i < lines.length; i++) {
      if (importLinesToRemove.has(i)) {
        if (insertImportsHere && i === firstImportLine) {
          for (const impLine of rebuiltImports) {
            newLines.push(impLine);
          }
          insertImportsHere = false;
        }
        continue;
      }
      if (i >= startIdx && i <= endIdx) {
        if (i === startIdx) {
          const rebuiltExport = rebuildExportBlock(allExportSymbols, keepSet);
          for (const expLine of rebuiltExport) {
            newLines.push(expLine);
          }
        }
        continue;
      }
      newLines.push(lines[i]);
    }

    const cleanedContent = newLines.join("\n") + (originalContent.endsWith("\n") ? "\n" : "");
    fs.writeFileSync(barrelFilePath, cleanedContent, "utf8");

    if (typeof buildCallback === "function") {
      await buildCallback();
    }

    fs.copyFileSync(backupPath, barrelFilePath);
    fs.unlinkSync(backupPath);
    console.log("cleanBarrelFile: build OK, barrel restored.");
  } catch (error) {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, barrelFilePath);
      fs.unlinkSync(backupPath);
    }
    console.error("cleanBarrelFile error, barrel restored:", error);
    throw error;
  }
};

export default cleanBarrelFile;
