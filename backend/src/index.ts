import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './Config/DatabaseConnection'

//TODO importar rutas
import routerUser from './Routes/User'
import routerAdmin from './Routes/Admin'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

//TODO Rutas
app.use('/user', routerUser)
app.use('/admin', routerAdmin)

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server active on port: ${port}`)
})