const express = require('express');

const router = express.Router();

// Handle GET request to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched.'
    });
});

// Handle POST request to /orders
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Orders were created.'
    });
});

// Handle GET request for specific IDs to /orders/orderID
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details.',
        orderId: req.params.orderId
    });
});

// Handle DELETE request to /orders
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted.',
        orderId: req.params.orderId
    });
});

module.exports = router;