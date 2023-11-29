import chai from 'chai'
import chaiHttp from 'chai-http'
import supertest from 'supertest'
import app from '../src/app.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Prueba de Session', () => {
  describe('GET /session/register', () => {
    it('Prueba de renderizado registro', async () => {
      const res = await chai.request(app).get('/session/register')
      expect(res).to.have.status(200)
      expect(res).to.be.html
    })
  })

  describe('GET /session/login', () => {
    it('Prueba de renderizado de login', async () => {
      const res = await chai.request(app).get('/session/login')
      expect(res).to.have.status(200)
      expect(res).to.be.html
    })
  })

  describe('POST /session/register', () => {
    it('Registro de usuario', async () => {
      const res = await chai.request(app).post('/session/register').send({
        first_name: 'jaime',
        last_name: 'Silva',
        email: 'jaimesilvalorca@gmail.comm',
        password: '1234567',
      })
      expect(res).to.have.status(200)
    })
  })

  describe('GET /session/login', () => {
    it('Prueba de renderizado del login', async () => {
      const res = await chai.request(app).get('/session/login')
      expect(res).to.have.status(200)
      expect(res).to.be.html
    })
  })

  describe('POST /session/login', () => {
    it('Prueba de login', async () => {
      const res = await chai.request(app).post('/session/login').send({
        email: 'jaimesilvalorca@gmail.comm',
        password: '1234567',
      })
      expect(res).to.have.status(200)
    })
  })
})