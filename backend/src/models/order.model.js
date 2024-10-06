import mongoose from "mongoose";

const deliveryDetailsSchema = new mongoose.Schema({
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
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem", // Assuming you have a Product schema
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Ensuring quantity is a positive number
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensuring price is non-negative
    }
});

const orderSchema = new mongoose.Schema({
    deliveryDetails: {
        type: deliveryDetailsSchema,
        required: true
    },
    orderItems: [{
        type: orderItemSchema,
        required: true
    }],
    subTotal: {
        type: Number,
        default: 0,
        required: true
    },
    tax: {
        type: Number,
        default: 0,
        required: true
    },
    deliveryCharges: {
        type: Number,
        default: 0,
        required: true
    },
    netTotal: {
        type: Number,
        default: 0,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["processing", "delivered", "cancelled"], 
        default: "processing", 
        required: true 
    }
}, { timestamps: true });

// Pre-save hook to calculate netTotal
orderSchema.pre('save', function(next) {
    console.log('---e---')
    const order = this;

    // Log to debug the context
    console.log(order);

    // Ensure orderItems is defined and is an array
    if (Array.isArray(order.orderItems)) {
        // Calculate subTotal by summing price * quantity for each item
        order.subTotal = order.orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    } else {
        order.subTotal = 0; // Set to 0 or handle this case accordingly
    }

    // Ensure subTotal, tax, and deliveryCharges are defined
    if (order.subTotal != null && order.tax != null && order.deliveryCharges != null) {
        order.netTotal = order.subTotal + order.tax + order.deliveryCharges;
    } else {
        console.error('subTotal, tax, or deliveryCharges is undefined');
    }

    next();
});

export const Order = mongoose.model("Order", orderSchema);
