import Order from '../models/Order.js';

export const getAllOrders = async (req, res) => {
  try {
    // Only fetch orders that are 'placed' or beyond (exclude 'Pending'/'Failed')
    const orders = await Order.find({ 
      status: { $in: ['placed', 'preparing', 'ready', 'delivered'] } 
    }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const simulateOrder = async (req, res) => {
  try {
    const { items, totalAmount, email, pickupTime } = req.body;
    
    const newOrder = new Order({
      email,
      items,
      totalAmount,
      pickupTime,
      status: 'placed',
      razorpay_order_id: `sim_${Date.now()}`
    });
    
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error simulating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
