// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

//Connects relationship between Category and Product models
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

//Connects the relationship between Product and Category models
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

//Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'product_tags'
});

// Connects relationship between the Tag and Product models where the ProductTag model for sharing keys
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'tag_products'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag
};