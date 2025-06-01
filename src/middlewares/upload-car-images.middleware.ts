import multer from "multer";
import minioClient from "../config/minio";
import { randomUUID } from "crypto";
import { MINIO_PUBLIC_URL } from "../config/vars";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const BUCKET_NAME = "car-images";

interface CarImagesRequest extends Request {
	files?: Express.Multer.File[];
	uploadedImages?: string[];
}

const uploadMiddleware = async (
	req: CarImagesRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	upload.array("images", 10)(req, res, async (err: any) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		if (!req.files || req.files.length === 0) {
			res.status(400).json({ error: "No images uploaded" });
			return;
		}

		try {
			const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
			if (!bucketExists) {
				await minioClient.makeBucket(BUCKET_NAME);
				const policy = `
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Sid": "PublicReadGetObject",
                            "Effect": "Allow",
                            "Principal": "*",
                            "Action": "s3:GetObject",
                            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
                        }
                    ]
                }`;
				await minioClient.setBucketPolicy(BUCKET_NAME, policy);
			}

			const uploadedFiles = await Promise.all(
				req.files.map(async (file) => {
					const uid = randomUUID();
					const fileExtension = file.originalname.split(".").pop();
					const fileName = `uploads/${uid}.${fileExtension}`;

					await minioClient.putObject(
						BUCKET_NAME,
						fileName,
						file.buffer,
						file.size,
						{
							"Content-Type": file.mimetype,
						}
					);

					return `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;
				})
			);

			req.uploadedImages = uploadedFiles;
			next();
		} catch (error) {
			console.error("MinIO Upload Error:", error);
			res.status(500).json({ error: "Image upload failed" });
		}
	});
};

export default uploadMiddleware;
