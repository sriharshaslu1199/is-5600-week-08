const cuid = require('cuid')

const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product', // ref will automatically fetch associated products for us
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options;

  const productQuery = productId ? {
    products: productId
  } : {}

  const statusQuery = status ? {
    status: status,
  } : {}

  const query = {
    ...productQuery,
    ...statusQuery
  };

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return orders
}



/**
 * Get an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function get(_id) {
  // using populate will automatically fetch the associated products.
  // if you don't use populate, you will only get the product ids
  const order = await Order.findById(_id)
    .populate('products')
    .exec()

  return order
}

async function edit(_id, change) {
  const order = await get(_id)

  Object.keys(change).forEach(function(key) {
    order[key] = change[key]
  })

  await order.save()

  return order
}

/**
 * Create an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}

module.exports = {
  create,
  get,
  list,
  edit
}
// tests/orders.test.js
const { create, get, list, edit } = require('../orders');
const orderData = require('../data/order1.json');
const productTestHelper = require('./test-utils/productTestHelper');

describe('Orders Module', () => {
 
  let createdProduct;
  let createdOrder;

  // Populate the database with dummy data
  beforeAll(async () => {
    await productTestHelper.setupTestData();
    await productTestHelper.createTestOrders(5);
  });

  afterAll(async () => {
    await productTestHelper.cleanupTestData();
  });

  describe('list', () => {
    it('should list orders', async () => {
      const orders = await list();
      expect(orders.length).toBeGreaterThan(4);
    });
  });
});
// tests/orders.test.js

describe('create', () => {
    it('should create an order', async () => {
      createdOrder = await create(orderData);
      expect(createdOrder).toBeDefined();
      expect(createdOrder.buyerEmail).toBe(orderData.buyerEmail);
    });
  });
  const order = await get(createdOrder._id);
  expect(order).toBeDefined();
    const change = {} // implement your change here
  const editedOrder = await edit(createdOrder._id, change)