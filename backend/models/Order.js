import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // allow guest checkout for now
  },
  email: {
    type: String,
    required: false
  },
  pickupTime: {
    type: String,
    required: false
  },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number,
      emoji: String,
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'placed', 'preparing', 'ready', 'delivered'],
    default: 'Pending'
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_payment_id: {
    type: String
  },
  razorpay_signature: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
