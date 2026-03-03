import { Worker } from "bullmq";
import { Redis } from "ioredis";
import path from "path";
import sharp from "sharp";
import { sendEmail } from "@/utils/email";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT! || 6379),
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "queue",
  async (job) => {
    const {
      type,
      filePath: base64Image,
      fileName,
      width,
      height,
      quality,
      email,
      subject,
      message,
    } = job.data;
    if (type === "image") {
      const filePath = Buffer.from(base64Image, "base64");
      const optimizedImagePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimized/",
        `${fileName.split(".")[0]}.webp`
      );
      await sharp(filePath)
        .resize(width, height)
        .webp(quality)
        .toFile(optimizedImagePath);
    } else if (type === "email") {
      await sendEmail({ email, subject, message });
    }
  },
  { connection }
);

worker.on("failed", (JobData, error) => {
  console.log(`Job is failed: ${error.message}`);
});

worker.on("completed", (JobData) => {
  console.log(`Job is complete ${JobData.id}`);
});
