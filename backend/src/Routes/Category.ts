import { Router } from "express"
import { getCategories } from "../Controllers/Category"

const routerCategory = Router()

routerCategory.get("", getCategories)

export default routerCategory
