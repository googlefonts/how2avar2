import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import revHash from "rev-hash";
import pMap from "p-map";

const concurrency = os.cpus().length;
const monorepoRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.resolve(monorepoRoot, "public");

async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function syncDirectory(srcDirName) {
  const srcDir = path.resolve(monorepoRoot, "..", srcDirName);
  const targetDir = path.resolve(publicDir, srcDirName);

  if (!(await pathExists(srcDir))) {
    console.warn(`Source directory "${srcDir}" does not exist. Skipping.`);
    return;
  }

  if (!(await pathExists(targetDir))) {
    await fs.mkdir(targetDir, { recursive: true });
  }

  const files = await Array.fromAsync(fs.glob("**/*", { cwd: srcDir }));

  await pMap(
    files,
    async (file) => {
      const srcPath = path.join(srcDir, file);
      const targetPath = path.join(targetDir, file);
      const stats = await fs.stat(srcPath);

      if (stats.isDirectory()) {
        if (!(await pathExists(targetPath))) {
          await fs.mkdir(targetPath, { recursive: true });
        }
        return;
      }

      async function copyFile() {
        await fs.copyFile(srcPath, targetPath);
        await fs.utimes(targetPath, stats.atime, stats.mtime);
      }

      if (!(await pathExists(targetPath))) {
        await copyFile();
        return;
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
