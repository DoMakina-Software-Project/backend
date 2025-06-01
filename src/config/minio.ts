import * as Minio from "minio";
import { MINIO } from "./vars";

const minioClient = new Minio.Client(MINIO);

export default minioClient;
