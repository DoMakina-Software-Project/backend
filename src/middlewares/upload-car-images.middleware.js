import multer from "multer";
import minioClient from "../config/minio.js";
import { randomUUID } from "crypto";
import { MINIO_PUBLIC_URL } from "../config/vars.js";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const BUCKET_NAME = "car-images";

// Middleware to handle image upload and send to MinIO
const uploadMiddleware = async (req, res, next) => {
	upload.array("images", 10)(req, res, async (err) => {
		if (err) {
			return res.status(400).json({ error: err.message });
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: "No images uploaded" });
		}

		try {
			// Ensure bucket exists
			const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
			if (!bucketExists) {
				// Create the bucket if it doesn't exist
				await minioClient.makeBucket(BUCKET_NAME);

				// Set the bucket policy to allow public access
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

				// Set the policy on the bucket
				await minioClient.setBucketPolicy(BUCKET_NAME, policy);
			}

			// Upload each image to MinIO
			const uploadedFiles = await Promise.all(
				req.files.map(async (file) => {
					const uid = randomUUID();
					const fileExtension = file.originalname.split(".").pop(); // Get file extension
					const fileName = `uploads/${uid}.${fileExtension}`; // Unique file name

					// Upload the file to MinIO
					await minioClient.putObject(
						BUCKET_NAME,
						fileName,
						file.buffer,
						{
							"Content-Type": file.mimetype,
						}
					);

					// Return the file URL
					return `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`;
				})
			);

			// Attach the uploaded image URLs to the request object
			req.uploadedImages = uploadedFiles;
			next(); // Proceed to next middleware
		} catch (error) {
			console.error("MinIO Upload Error:", error);
			return res.status(500).json({ error: "Image upload failed" });
		}
	});
};

export default uploadMiddleware;
