import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, email, pickupTime } = req.body;

    // Check if total amount is valid
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

    // Save order in database with pending status
    const newOrder = new Order({
      email,
      pickupTime,
      items: items || [],
      totalAmount,
      status: 'Pending',
      razorpay_order_id: razorpayOrder.id,
    });
    
    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrderId: newOrder._id
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      dbOrderId 
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Create HMAC hex digest
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      
      // Update order in database - set status to 'placed' for the canteen workflow
      await Order.findByIdAndUpdate(dbOrderId, {
        status: 'placed',
        razorpay_payment_id,
        razorpay_signature
      });

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
