import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const token = req.cookies.auth_token;
        if (token && token.trim() !== "") {
            return res.status(200).json({ message: "Authenticated", token });
        }

        return res.status(400).json({ message: "No auth token" });
    } catch (error) {

    }
}
