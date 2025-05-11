const cuid = require('cuid')
const db = require('./db')

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }],
})

/**
 * List products
 * @param {*} options 
 * @returns 
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {}

  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(_id) {
  const product = await Product.findById(_id)
  return product
}

async function create(fields) {
  const product = await new Product(fields).save()
  return product
}

async function edit(_id, change) {
  const product = await get(_id)

  Object.keys(change).forEach(function(key) {
    product[key] = change[key]
  })

  await product.save()

  return product
}

async function destroy(_id) {
  return await Product.deleteOne({ _id })
}

module.exports = {
  list,
  create,
  edit,
  destroy,
  get
}
// tests/products.test.js
const productTestHelper = require('./test-utils/productTestHelper');
const { list } = require('../products');

describe('Product Module', () => {
  // Set up and clean up test data
  beforeAll(async () => {
    await productTestHelper.setupTestData();
  });

  afterAll(async () => {
    await productTestHelper.cleanupTestData();
  });

  // your tests go here
});
// tests/product.test.js

// This test goes in the greater `describe('Product Module')` function
describe('list', () => {
  it('should list all products', async () => {
    const products = await list();
    expect(products.length).toBeGreaterThan(0);
  });
});
describe('get', () => {
  it('should retrieve a product by id', async () => {
    // Assume there is a product with id 'abc123'
    const product = await get('abc123');
    expect(product).not.toBeNull();
  });
});
// This would delete the product after the first test, and fail every other test afterwards.
 describe('destroy', () => {
  it('should delete a product', async () => {
    // Assume there is a product with id 'abc123'
    await destroy('abc123');
    const product = await get('abc123');
    expect(product).toBeNull();
  });
});
// tests/product.test.js
const { mockDb, mockProducts } = require('./db.mock');
const { list } = require('../products');

// Mock the db module to use our mockDb
jest.mock('../db', () => mockDb);

describe('Product Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // your tests go here
});
// tests/products.test.js


// replace your current list test with this below:
  describe('list', () => {
      it('should list products', async () => {
          const products = await list();
          expect(products.length).toBe(2);
          expect(products[0].description).toBe('Product 1');
          expect(products[1].description).toBe('Product 2');
      });
  });
  describe('get', () => {
  it('should get a product by id', async () => {
    // Mock the Product.findById method to return a specific product
    mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });

    // call to get the product using the `get` method
    // your assertions
  });
});
mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });