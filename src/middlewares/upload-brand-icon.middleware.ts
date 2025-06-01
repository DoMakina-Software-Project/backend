import multer from "multer";
import minioClient from "../config/minio";
import { randomUUID } from "crypto";
import { MINIO_PUBLIC_URL } from "../config/vars";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const BUCKET_NAME = "brand-icons";

interface BrandIconRequest extends Request {
	file?: Express.Multer.File;
	iconUrl?: string | null;
}

const uploadMiddleware = async (
	req: BrandIconRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	upload.single("icon")(req, res, async (err: any) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		if (!req.file) {
			req.iconUrl = null;
			next();
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

			const uid = randomUUID();
			const fileExtension = req.file.originalname.split(".").pop();
			const fileName = `uploads/${uid}.${fileExtension}`;

			await minioClient.putObject(
				BUCKET_NAME,
				fileName,
				req.file.buffer,
				req.file.size,
				{
					"Content-Type": req.file.mimetype,
				}
			);

			req.iconUrl = `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;
			next();
		} catch (error) {
			console.error("MinIO Upload Error:", error);
			res.status(500).json({ error: "Image upload failed" });
		}
	});
};

export default uploadMiddleware;
