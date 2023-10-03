import Product from "../model/productModel.js"
import ApiFeatures from "../utils/apiFeatures.js";
//create product
export const createProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(200).send({ success: true, product })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : false ,status:500,error:error.message});
    }
}

// Get all Products
export const getAllProducts = async (req, res) => {
    try {
        const productCount = await Product.countDocuments()
        const resultPerPage = 5;

        const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
        const products = await apiFeatures.query;
        res.status(200).send({ success: true, products,productCount })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : false ,status:500,error:error.message});
    }
}

// Update product 
export const updateProduct = async (req, res) => {
    try {

        let product = Product.findById(req.params.id);

        if (!product) {
            return res.status(500).send({
                success: false,
                message: "Product is not found"
            })
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : false ,status:500,error:error.message});
    }
}

// Delete product 

export const deleteProduct = async (req, res, next) => {
    try {

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(500).send({ success: false, message: "Not found" });
        }

        product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : false ,status:500,error:error.message});
    }

}

// Get product details 

export const getProductDetails = async (req, res, next) => {
    try {

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(500).send({ success: false, message: "Not found" });
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : false ,status:500,error:error.message});
    }

}