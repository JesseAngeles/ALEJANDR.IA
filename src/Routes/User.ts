import { Router } from "express";
import { test } from "../Controllers/User";

const routerUser = Router()

routerUser.get("", test)

export default routerUser