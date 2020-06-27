import { Router } from "express";

import {
  signup,
  signin,
  profile,
  updateProfile,
  deleteProfile
} from "../controllers/auth.controller";

import { TokenValidation } from "../middlewares/verifyToken";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile/:userId", TokenValidation, profile);
router.patch("/profile/update/:userId", updateProfile);
router.delete("/profile/delete/:userId", deleteProfile);

export default router;
