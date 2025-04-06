import { Payment } from "../Interfaces/Payment"
import mongoose from "mongoose"

const { Schema } = mongoose

const paymentSchema = new Schema<Payment>({
    tmp: {
        type: Schema.Types.String,
        required:true
    }
})

export default mongoose.model<Payment>('payments',paymentSchema)