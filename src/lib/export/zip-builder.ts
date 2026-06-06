import JSZip from "jszip";

export class ZipBuilder {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  /**
   * Adds a file to the ZIP archive.
   */
  addFile(path: string, content: string | Buffer): this {
    this.zip.file(path, content);
    return this;
  }

  /**
   * Adds an empty folder to the ZIP archive.
   */
  addFolder(path: string): this {
    this.zip.folder(path);
    return this;
  }

  /**
   * Generates the final ZIP file as a Node Buffer.
   */
  async generateBuffer(): Promise<Buffer> {
    const uint8Array = await this.zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });
    return Buffer.from(uint8Array);
  }
}
