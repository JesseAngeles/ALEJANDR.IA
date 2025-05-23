import { Router } from "express";
import { refreshAccessToken } from "../Controllers/Auth";

const router = Router();

router.get("/refresh", refreshAccessToken);

export default router;