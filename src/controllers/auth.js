const { v4: uuidv4 } = require('uuid')
const { DataDB } = require('../db/data')
const dataDb = new DataDB()
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')

const createUser = async (req, reply) => {
  try {
    const existUser = await dataDb.findUser(req.body.email)
    console.log('existUser', existUser)
    if (existUser) {
      reply.code(409).send(new Error('User exists'))
    }
    const newUser = await dataDb.createUser(req.body)
    reply.code(200).send(newUser)
  } catch (error) {
    reply.code(500)
  }
}

const loginUser = async (req, reply) => {
  const { email, password } = req.body
  const existUser = await dataDb.findUser(email)
  if(!existUser)  { reply.code(404).send(new Error('Not found')) }
  console.log('existUser', existUser);
  if (!bcrypt.compareSync(password, existUser.password)) {
    reply.code(400).send(new Error('Password doesnt match'))
  }
  existUser.token = sign({ id: existUser._id, role: 'user' }, process.env.JWT_SECRET_KEY)
  reply.code(200).send(existUser)
}

module.exports = {
  createUser,
  loginUser
}