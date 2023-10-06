import Product from "../model/productModel.js"
import ApiFeatures from "../utils/apiFeatures.js";
//create product
export const createProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(200).json({ success: true, product })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}

// Get all Products
export const getAllProducts = async (req, res) => {
    try {
        const productCount = await Product.countDocuments()
        const resultPerPage = 5;

        const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
        const products = await apiFeatures.query;
        res.status(200).send({ success: true, products, productCount })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
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
        res.status(500).send({ success: false, status: 500, error: error.message });
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
        res.status(500).send({ success: false, status: 500, error: error.message });
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
        res.status(500).send({ success: false, status: 500, error: error.message });
    }

}

export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId);

        const isReviewed = await product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
        if (isReviewed) {
            product.reviews.forEach(rev => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment)
            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        let avg = 0;
        product.reviews.forEach(rev => {
            avg += rev.rating;
        })

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });
        res.status(200).json({ status: 200, success: true, message: "Rating Add Successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}

export const getAllReaviews = async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) {
            return res.status(404).send({ status: 404, success: false, message: 'Product not found' })
        }

        res.status(200).send({ status: 200, success: true, reviews: product.reviews })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}

export const deleteReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).send({ status: 404, success: false, message: 'Product not found' })
        }

        const reviews = await product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

        let avg = 0;

        reviews.forEach(rev => avg += rev.rating)
        const ratings = avg / reviews.length
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            ratings,
            numOfReviews,
            reviews
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

        res.status(200).send({ status: 200, success: true, message: 'Product deleted Successfully' });
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}
