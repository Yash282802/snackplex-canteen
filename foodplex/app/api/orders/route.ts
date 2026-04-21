import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const EXCEL_FILE = path.join(process.cwd(), 'orders.xlsx');

interface OrderRow {
  'Order ID': string;
  'Email': string;
  'Items': string;
  'Total (₹)': number;
  'Pickup Time': string;
  'Status': string;
  'Date': string;
}

function readOrders(): OrderRow[] {
  try {
    if (fs.existsSync(EXCEL_FILE)) {
      const data = fs.readFileSync(EXCEL_FILE);
      const workbook = XLSX.read(data, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json<OrderRow>(sheet);
    }
  } catch (e) {
    console.log('Error reading orders:', e);
  }
  return [];
}

function writeOrders(orders: OrderRow[]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(orders);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, EXCEL_FILE);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, order } = body;

    if (action === 'add') {
      const orders = readOrders();
      
      const itemsList = order.items.map((i: { emoji: string; name: string; qty: number }) => 
        `${i.emoji} ${i.name} x${i.qty}`
      ).join(', ');

      const newRow: OrderRow = {
        'Order ID': order.id,
        'Email': order.email,
        'Items': itemsList,
        'Total (₹)': order.total,
        'Pickup Time': order.pickupTime,
        'Status': 'Placed',
        'Date': new Date(order.createdAt).toLocaleString(),
      };

      orders.push(newRow);
      writeOrders(orders);

      return NextResponse.json({ success: true, message: 'Order added to Excel' });
    }

    if (action === 'updateStatus') {
      const orders = readOrders();
      const idx = orders.findIndex(o => o['Order ID'] === order.id);
      if (idx !== -1) {
        orders[idx]['Status'] = order.status;
        writeOrders(orders);
      }
      return NextResponse.json({ success: true, message: 'Status updated' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Excel API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  const orders = readOrders();
  return NextResponse.json({ orders });
}