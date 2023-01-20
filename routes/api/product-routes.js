const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    res.status(200).json(productData)
  } catch (err) {
    res.json(500).json(err);
  }
});

//finds products by 'id' value
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category }, { model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Creates a new product
router.post('/', async (req, res) => {
  try {
    let product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      let productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    res.status(200).json(productTagIds);
    } else {
    res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//UPdates a product by its 'id'
router.put('/:id', async (req, res) => {
  try {
    let product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    let productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    if (req.body.tagIds) {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
      let updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      res.status(200).json(updatedProductTags);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//Deletes a product by its 'id'
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;