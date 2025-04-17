import Product from '../Models/product.model.js';
import uploadOnCloudinary from '../Utils/cloudinary.js';
import fs from "fs";

const addProduct = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one image is required" 
            });
        }

        // Check if more than 4 images were uploaded
        if (req.files.length > 4) {
            // Delete the temporarily stored files
            req.files.forEach(async (file) => {
                await fs.promises.unlink(file.path);
            });
            return res.status(400).json({ 
                success: false, 
                message: "Maximum 4 images allowed" 
            });
        }

        // Upload images to Cloudinary
        const imageUploadPromises = req.files.map(async (file) => {
            const result = await uploadOnCloudinary(file.path);
            return result?.url || null;
        });

        // Wait for all uploads to complete
        const imageUrls = await Promise.all(imageUploadPromises);
        
        // Filter out any failed uploads
        const validImageUrls = imageUrls.filter(url => url !== null);

        // Check if we have at least one valid image
        if (validImageUrls.length === 0) {
            return res.status(500).json({ 
                success: false, 
                message: "Failed to upload images to Cloudinary" 
            });
        }

        // Extract product data from request body
        const { 
            title, 
            description, 
            price, 
            category, 
            location,
            condition,
            negotiable,
            user
        } = req.body;

        // Create new product in database
        const product = await Product.create({
            title,
            description,
            price,
            category,
            location,
            condition: condition || 'used',
            negotiable: negotiable || false,
            user,
            images: validImageUrls
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        // Clean up any uploaded files if error occurs
        if (req.files) {
            req.files.forEach(async (file) => {
                try {
                    await fs.promises.unlink(file.path);
                } catch (err) {
                    console.error("Error deleting temporary file:", err);
                }
            });
        }

        console.error("Error creating product:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export { addProduct };