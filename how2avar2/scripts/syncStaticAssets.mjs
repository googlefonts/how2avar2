import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import revHash from "rev-hash";
import pMap from "p-map";

const concurrency = os.cpus().length;
const monorepoRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.resolve(monorepoRoot, "public");

async function pathExists(path) {
  return await fs.access(path).then(
    () => true,
    () => false,
  );
}

async function ensureDir(directory) {
  if (!(await pathExists(directory))) {
    await fs.mkdir(directory, { recursive: true });
  }
}

async function syncDirectory(srcDirName) {
  const srcDir = path.resolve(monorepoRoot, "..", srcDirName);
  const targetDir = path.resolve(publicDir, srcDirName);

  if (!(await pathExists(srcDir))) {
    console.warn(`Source directory "${srcDir}" does not exist. Skipping.`);
    return;
  }

  await ensureDir(targetDir);

  const files = await Array.fromAsync(fs.glob("**/*", { cwd: srcDir }));

  await pMap(
    files,
    async (file) => {
      const srcPath = path.join(srcDir, file);
      const targetPath = path.join(targetDir, file);
      const stats = await fs.stat(srcPath);

      if (stats.isDirectory()) {
        return await ensureDir(targetPath);
      }

      async function copyFile() {
        await ensureDir(path.dirname(targetPath));
        await fs.copyFile(srcPath, targetPath);
        await fs.utimes(targetPath, stats.atime, stats.mtime);
      }

      if (!(await pathExists(targetPath))) {
        return await copyFile();
      }

      const targetStats = await fs.stat(targetPath);
      if (stats.mtimeMs === targetStats.mtimeMs) {
        return;
      }

      // Timestamps differ, check hash
      const srcHash = revHash(await fs.readFile(srcPath));
      const targetHash = revHash(await fs.readFile(targetPath));

      if (srcHash !== targetHash) {
        await copyFile();
      } else {
        // Same content, update timestamp
        await fs.utimes(targetPath, stats.atime, stats.mtime);
      }
    },
    { concurrency },
  );
}

export async function syncStaticAssets() {
  const start = performance.now();
  await syncDirectory("tests");
  await syncDirectory("fonts");
  const duration = performance.now() - start;
  console.log(`[Sync] synced assets in ${duration}ms`);
}
