import mongoose from "mongoose";

const deliveryDetailsScehma = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        trim: true
    }
});

const orderItemSchema = new mongoose.Schema({

});

const orderSchema = new mongoose.Schema({
    deliveryDetails: {
        type: deliveryDetailsScehma,
        required: true
    },
    orderItems: [{
        type: orderItemSchema,
        required: true
    }],
    subTotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    deliveryCharges: {
        type: Number,
        required: true,
    },
    netTotal: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    orderBy: {
        type: mongoose.Schema.Types.OrderId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);