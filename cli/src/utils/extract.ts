import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AIType } from '../types/index.js';
import { AI_FOLDERS } from '../types/index.js';

export async function extractZip(zipPath: string, destDir: string): Promise<void> {
  const proc = Bun.spawn(['unzip', '-o', zipPath, '-d', destDir], {
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Failed to extract zip: exit code ${exitCode}`);
  }
}

export async function copyFolders(
  sourceDir: string,
  targetDir: string,
  aiType: AIType
): Promise<string[]> {
  const copiedFolders: string[] = [];

  const foldersToCopy = aiType === 'all'
    ? ['.claude', '.cursor', '.windsurf', '.agent', '.shared']
    : AI_FOLDERS[aiType];

  // Deduplicate folders (e.g., .shared might be listed multiple times)
  const uniqueFolders = [...new Set(foldersToCopy)];

  for (const folder of uniqueFolders) {
    const sourcePath = join(sourceDir, folder);
    const targetPath = join(targetDir, folder);

    // Check if source folder exists
    const sourceExists = await Bun.file(sourcePath).exists().catch(() => false);
    if (!sourceExists) {
      // Try checking if it's a directory
      try {
        const proc = Bun.spawn(['test', '-d', sourcePath]);
        await proc.exited;
      } catch {
        continue;
      }
    }

    // Create target directory if needed
    await mkdir(targetPath, { recursive: true });

    // Copy using cp -r
    const proc = Bun.spawn(['cp', '-r', `${sourcePath}/.`, targetPath], {
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const exitCode = await proc.exited;
    if (exitCode === 0) {
      copiedFolders.push(folder);
    }
  }

  return copiedFolders;
}

export async function cleanup(tempDir: string): Promise<void> {
  const proc = Bun.spawn(['rm', '-rf', tempDir], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  await proc.exited;
}
