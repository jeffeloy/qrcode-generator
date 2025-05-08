import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import type { StoragePort, UploadParams } from "../ports/storage-port"

export class S3StorageAdapter implements StoragePort {
  private s3Client: S3Client
  private bucketName: string
  private region: string

  constructor(region: string, bucketName: string) {
    this.bucketName = bucketName
    this.region = region
    this.s3Client = new S3Client({ region })
  }

  async uploadFile(params: UploadParams): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: params.fileName,
          Body: params.buffer,
          ContentType: params.contentType,
        }),
      )

      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${params.fileName}`
    } catch (error) {
      throw new Error("Error uploading file to S3")
    }
  }

  async delete(fileName: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      )
    } catch (error) {
      throw new Error("Error deleting file from S3")
    }
  }
}
