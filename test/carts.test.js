import chai from 'chai'
import chaiHttp from 'chai-http'
import supertest from 'supertest'
import CartModel from '../src/models/carts.models.js'
import app from '../src/app.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Test Cart!', () => {
  beforeEach(async () => {
    await CartModel.deleteMany({})
  })

  describe('GET /api/carts', () => {
    it('Prueba de obtener el carrito', async () => {
      await CartModel.create([
        { items: ['Producto 1', 'Producto 2'] },
        { items: ['Producto 3', 'Producto 4'] },
      ])

      const res = await chai.request(app).get('/api/carts')
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('carts').that.is.an('array')
      expect(res.body.carts.length).to.equal(2)
    })
  })

  describe('POST /api/carts', () => {
    it('Agregar al carrito', async () => {
      const res = await chai.request(app).post('/api/carts')
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('status', 'Success')
      expect(res.body).to.have.nested.property('newCart._id')
    })
  })

  describe('POST /api/carts/:cid/products/:pid', () => {
    it('Agregar producto al carrito', async () => {
      const cart = await CartModel.create({})
      const product = await ProductModel.create({ title: 'Nuevo Producto', stock: 10 })

      const res = await chai.request(app).post(`/api/carts/${cart._id}/products/${product._id}`).send({ quantity: 2 })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('status', 'Carrito Actualizado!')
      expect(res.body).to.have.nested.property('cart._id', cart._id.toString())
    })
  })
})
