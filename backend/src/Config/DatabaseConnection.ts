import mongoose from "mongoose"

require('dotenv').config()

const connectDB = async (): Promise<void> => {
    try {
        const mongoUrl:string = `${process.env.MONGO_URL}`
        await mongoose.connect(mongoUrl);

        console.log(`Database connected`)
        } catch (error) {
        console.log(`Error connecting database: ${error}`)
        process.exit(1)
    }
}

export default connectDB