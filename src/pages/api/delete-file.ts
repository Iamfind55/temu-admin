import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  const { secureUrl } = req.body;
  if (!secureUrl) return res.status(400).json({ error: "Missing secureUrl" });
  try {
    const publicId = secureUrl.match(/upload\/(?:v\d+\/)?([^\.]+)/)?.[1];
    if (!publicId) throw new Error("Invalid Cloudinary URL");

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    return res.status(200).json({ result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
