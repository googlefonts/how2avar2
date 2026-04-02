import fs from "node:fs/promises";
import path from "node:path";
import revHash from "rev-hash";

const monorepoRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.resolve(monorepoRoot, "public");

async function syncDirectory(srcDirName) {
  const srcDir = path.resolve(monorepoRoot, "..", srcDirName);
  const targetDir = path.resolve(publicDir, srcDirName);

  if (!(await fs.access(srcDir).then(() => true, () => false))) {
    console.warn(`Source directory "${srcDir}" does not exist. Skipping.`);
    return;
  }

  await fs.cp(srcDir, targetDir, {
    recursive: true,
    preserveTimestamps: true,
    filter: async (src, dest) => {
      const srcStat = await fs.stat(src);
      if (srcStat.isDirectory()) return true;

      const destStat = await fs.stat(dest).catch((error) => {
        if (error.code === "ENOENT") return undefined;
        throw error;
      });

      if (!destStat) return true;

      if (srcStat.mtimeMs === destStat.mtimeMs) return false;

      const srcHash = revHash(await fs.readFile(src));
      const destHash = revHash(await fs.readFile(dest));

      if (srcHash === destHash) {
        await fs.utimes(dest, srcStat.atime, srcStat.mtime);
        return false;
      }

      return true;
    },
  });
}

export async function syncStaticAssets() {
  const start = performance.now();
  await syncDirectory("tests");
  await syncDirectory("fonts");
  const duration = performance.now() - start;
  console.log(`[Sync] synced assets in ${duration}ms`);
}
