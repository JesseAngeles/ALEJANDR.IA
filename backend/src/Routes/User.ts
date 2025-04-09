import { Router } from "express";
import { add, getAll, getById, update, drop } from "../Controllers/User";

const routerUser = Router()

routerUser.post('', add);
routerUser.get('', getAll);
routerUser.get('/:id', getById);
routerUser.put('/:id', update);
routerUser.delete('/:id', drop);

export default routerUser