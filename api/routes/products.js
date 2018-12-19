const express = require('express');

const router = express.Router();

// Handle GET request to /products
router.get('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling GET requests to /products'
    });
});

// Handle POST request to /products
router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST requests to /products'
    });
});

// Handle GET request for specific IDs to /products/productID
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered a special ID!',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID.'
        });
    }
});

// Handle PATCH request for a specific ID to /products/productID
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

// Handle DELETE request for a specific ID to /products/productID
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted Product!'
    });
});

module.exports = router;