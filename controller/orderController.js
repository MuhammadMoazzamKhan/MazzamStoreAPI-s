import Order from "../model/orderModel.js";
import Product from "../model/productModel.js"

export const newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
        });

        return res.status(200).json({ status: 200, success: true, message: `Order is in process`, order })
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate([
            {
                path: "user",
                select: 'name , email',
                strictPopulate: false
            }]);
        if (!order) {
            return res.status(404).send({ message: `Order not found with this ${req.params.id} ID`, success: false, status: 404 })
        }
        return res.status(200).json({ success: true, status: 200, order })


    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

export const myOrders = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user._id })
        res.status(200).json({ success: true, status: 200, order })
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

// Admin Func
export const getAllOrders = async (req, res) => {
    try {
        const order = await Order.find()
        let totalAmout = 0;
        order.forEach(order => totalAmout += order.totalPrice);
        res.status(200).json({ success: true, status: 200, totalAmout, order })
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

// Admin Func
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).send({ message: `Order not found with this ${req.params.id} ID`, success: false, status: 404 })
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({ status: 400, success: false, message: "You have already delivered this order" })
        }

        order.orderItems.forEach(async order => await updateStock(order.product, order.quantity));
        order.orderStatus = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now()
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, status: 200, message: "Order Update Successfully" })
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

async function updateStock(id, quantity) {
    try {
        const product = await Product.findById(id);

        product.Stock -= quantity
        await product.save({ validateBeforeSave: false });
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send({ message: `Order not found with this ${req.params.id} ID`, success: false, status: 404 })
        }
        res.status(200).json({ status: true, success: true, message: 'Product has been deleted Successfully' });
    } catch (error) {
        return res.status(400).json({ status: 400, success: false, message: `Some issue accured`, error: error.message })
    }
}


