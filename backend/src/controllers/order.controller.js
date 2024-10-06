import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createOrderAndPaymentInitiator = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.deliveryDetails || !reqBody.orderItems || !reqBody.orderBy) throw new ApiError(400, "Invalid request.");

        if(!reqBody.deliveryDetails?.address || !reqBody.deliveryDetails?.locality || !reqBody.deliveryDetails?.state || !reqBody.deliveryDetails?.district || !reqBody.deliveryDetails?.pinCode) throw new ApiError(400, "Invalid request.");

        if (reqBody.orderItems.some(item => 
            item.productId == null || item.quantity == null || item.price == null
        )) {
            throw new ApiError(400, "Order items must have productId, quantity, and price.");
        }

        // calculate netTotal amount of order
        const tax = 0;
        const deliveryCharges = 0;

        // create order
        const order = new Order({
            deliveryDetails: reqBody.deliveryDetails,
            orderItems: reqBody.orderItems,
            orderBy: reqBody.orderBy
        });

        order.save();

        if(!order) throw new ApiError(500, "Error while creating the new order.");

        const createdOrder = await Order.findById(order?._id);

        return res
        .status(201)
        .json(new ApiResponse(
            201,
            createdOrder,
            "Order created successfully."
        ));

    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode : 500, err.message? err.message : "Something went wrong while creating the order.");
    }
});

const verifyOrderPayment = asyncHandler(async (req, res, next) => {
    try {

    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode : 500, err.message? err.message : "Something went wrong while verifying the order payment.");
    }
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.body)
        const reqBody = req.body;

        if(!reqBody.orderId) throw new ApiError(400, "'orderId' is required.");
        if(!reqBody.orderStatus) throw new ApiError(400, "'orderStatus' is required.");

        const updatedOrder = await Order.findByIdAndUpdate(
            reqBody.orderId,
            {
                $set: {
                    orderStatus: reqBody.orderStatus
                }
            },
            { 
                runValidators: true,
                new: true 
            }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedOrder,
            "Order status updated successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode : 500, err.message? err.message : "Something went wrong while updating the order status.");
    }
});

const getAllOrdersList = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.find({orderBy: user._id})
        .populate("orderBy", "email firstName lastName")
        .populate("deliveryDetails", "-_id");

        // Transform the orders to include only desired fields
        const response = orders.map(order => ({
            ...order._doc, 
            deliveryDetails: {
                address: order.deliveryDetails.address,
                locality: order.deliveryDetails.locality,
                state: order.deliveryDetails.state,
                district: order.deliveryDetails.district,
                pinCode: order.deliveryDetails.pinCode
                // _id is omitted intentionally
            },
            orderItems: order.orderItems.map(item => ({
                productId: item.productId, 
                quantity: item.quantity,
                price: item.price
                // _id is omitted intentionally
            }))
        }));

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            response,
            "Orders list fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode : 500, err.message? err.message : "Something went wrong while fetching the orders list.");
    }
});

const getOnlyUserSpecificOrdersList = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);

        const orders = await Order.find({orderBy: user._id})
        .populate("orderBy", "email firstName lastName")
        .populate("deliveryDetails", "-_id");

        // Transform the orders to include only desired fields
        const response = orders.map(order => ({
            ...order._doc, 
            deliveryDetails: {
                address: order.deliveryDetails.address,
                locality: order.deliveryDetails.locality,
                state: order.deliveryDetails.state,
                district: order.deliveryDetails.district,
                pinCode: order.deliveryDetails.pinCode
                // _id is omitted intentionally
            },
            orderItems: order.orderItems.map(item => ({
                productId: item.productId, 
                quantity: item.quantity,
                price: item.price
                // _id is omitted intentionally
            }))
        }));

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            response,
            "User Orders list fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode : 500, err.message? err.message : "Something went wrong while fetching the user orders list.");
    }
});

export {
    createOrderAndPaymentInitiator,
    verifyOrderPayment,
    getAllOrdersList,
    getOnlyUserSpecificOrdersList,
    updateOrderStatus
}