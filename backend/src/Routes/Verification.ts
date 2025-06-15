import { Router } from "express"
import { generateVerificationToken, verifyAccountWithToken } from "../Controllers/Verification"
import { validateRequest } from "../Middleware/ValidateRequest"
import { ValGenerateToken, ValVerifyToken } from "../Validations/Verification"

const routerVerification = Router()

routerVerification.post("", validateRequest(ValGenerateToken), generateVerificationToken)
routerVerification.put("", validateRequest(ValVerifyToken), verifyAccountWithToken)

export default routerVerification
