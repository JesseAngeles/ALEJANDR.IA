import { Router } from "express"
import { searchWithFilter } from "../Controllers/Search"

const routerSearch = Router()

routerSearch.post("/", searchWithFilter)

export default routerSearch
