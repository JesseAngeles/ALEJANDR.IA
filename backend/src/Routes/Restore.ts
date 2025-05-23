import { Router } from "express"
import { generateRestoreToken, restorePassWithToken } from "../Controllers/Restore"
import { validateRequest } from "../Middleware/ValidateRequest"
import { ValGenerateToken, ValRestoreToken } from "../Validations/Restore"

const routerRestore = Router()

routerRestore.post("", validateRequest(ValGenerateToken), generateRestoreToken)
routerRestore.put("", validateRequest(ValRestoreToken), restorePassWithToken)

export default routerRestore
