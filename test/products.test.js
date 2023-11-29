import chai from 'chai'
import chaiHttp from 'chai-http'
import supertest from 'supertest'
import ProductModel from '../src/models/products.models.js'
import app from '../src/app.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Prueba de productos!', () => {
    beforeEach(async () => {
    await ProductModel.deleteMany({})
  })

  describe('GET /api/products', () => {
    it('Lista los productos ', async () => {
      await ProductModel.create([
        { title: 'Producto 1' },
        { title: 'Producto 2' },
      ])

      const res = await chai.request(app).get('/api/products')
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.equal(2)
    })
  })

  describe('POST /api/products', () => {
    it('Agrega los nuevos productos', async () => {
      const newProduct = { title: 'Nuevo Producto' }

      const res = await chai.request(app).post('/api/products').send(newProduct)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('status', 'Producto agregado')
      expect(res.body).to.have.nested.property('productAdded.title', 'Nuevo Producto')
    })
  })

  describe('GET /api/products/:id', () => {
    it('Obtener producto por el id', async () => {
      const product = await ProductModel.create({ title: 'Producto' })

      const res = await chai.request(app).get(`/api/products/${product._id}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('product')
      expect(res.body.product._id).to.equal(product._id.toString())
    })
  })

  describe('DELETE /api/products/:pid', () => {
    it('Eliminar producto por el id', async () => {
      const product = await ProductModel.create({ title: 'Producto' })

      const res = await chai.request(app).delete(`/api/products/${product._id}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('status', 'Sucess')
      expect(res.body).to.have.property('message', 'Producto Eliminado')
    })
  })

  describe('PUT /api/products/:pid', () => {
    it('Actualizar producto por el id', async () => {
      const product = await ProductModel.create({ title: 'Producto' })
      const updatedProduct = { title: 'Producto Actualizado' }

      const res = await chai.request(app).put(`/api/products/${product._id}`).send(updatedProduct)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('status', 'producto actualizado')
      expect(res.body.product).to.have.property('nModified', 1)
    })
  })

})