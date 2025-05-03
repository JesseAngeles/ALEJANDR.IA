import { Router } from "express"
import { searchWithFilter } from "../Controllers/Search"

const routerSearch = Router()

routerSearch.get("/", searchWithFilter)

export default routerSearch
