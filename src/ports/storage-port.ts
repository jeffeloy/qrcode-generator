export interface UploadParams {
  fileName: string
  contentType: string
  buffer: Buffer
}

export interface StoragePort {
  uploadFile(params: UploadParams): Promise<string>
  delete?(key: string): Promise<void>
}
