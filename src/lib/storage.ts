import { writeFile, mkdir, unlink, rename, access } from "node:fs/promises";
import path from "node:path";

export interface IStorageService {
  save(buffer: Buffer, relativePath: string): Promise<string>;
  delete(relativePath: string): Promise<void>;
  move(sourceRelative: string, destRelative: string): Promise<string>;
  exists(relativePath: string): Promise<boolean>;
}

const UPLOAD_ROOT = path.join(process.cwd(), "public");

export const storageService: IStorageService = {
  async save(buffer: Buffer, relativePath: string): Promise<string> {
    const absolutePath = path.join(UPLOAD_ROOT, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, buffer);
    return relativePath;
  },

  async delete(relativePath: string): Promise<void> {
    const absolutePath = path.join(UPLOAD_ROOT, relativePath);
    try {
      await unlink(absolutePath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  },

  async move(sourceRelative: string, destRelative: string): Promise<string> {
    const sourceAbs = path.join(UPLOAD_ROOT, sourceRelative);
    const destAbs = path.join(UPLOAD_ROOT, destRelative);
    await mkdir(path.dirname(destAbs), { recursive: true });
    await rename(sourceAbs, destAbs);
    return destRelative;
  },

  async exists(relativePath: string): Promise<boolean> {
    const absolutePath = path.join(UPLOAD_ROOT, relativePath);
    try {
      await access(absolutePath);
      return true;
    } catch {
      return false;
    }
  },
};
