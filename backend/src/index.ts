import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './Config/DatabaseConnection'

//TODO importar rutas
import routerUser from './Routes/User'
import routerAdmin from './Routes/Admin'
import routerBook from './Routes/Book'
import routerCart from './Routes/Cart'
import routerCollection from './Routes/Collection'
import routerDiscount from './Routes/Discount'
import routerOrder from './Routes/Order'
import routerSearch from './Routes/Search'
import routerCategory from './Routes/Category'
import routerReport from './Routes/Reports'
import routerRestore from './Routes/Restore'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

//TODO Rutas
app.use('/user', routerUser)
app.use('/admin', routerAdmin)
app.use('/book', routerBook)
app.use('/cart', routerCart)
app.use('/collection', routerCollection)
app.use('/discount', routerDiscount)
app.use('/order', routerOrder)
app.use('/search', routerSearch)
app.use('/category', routerCategory)
app.use('/report', routerReport)
app.use('/restore', routerRestore)

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server active on port: ${port}`)
})
