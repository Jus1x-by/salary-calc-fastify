const { v4: uuidv4 } = require('uuid')
const { DataDB } = require('../db/data')
const dataDb = new DataDB()
const bcrypt = require('bcrypt')

const createUser = async (req, reply) => {
  const existUser = await dataDb.findUser(req.body.email);
  if (existUser) {
    reply.code(409).send('User with that email exists')
  }
  const newUser = await dataDb.createUser(req.body)
  reply.code(200).send(newUser);
}

const loginUser = async (req, reply) => {
  const { email, password } = req.body
  const existUser = await dataDb.findUser(email)
  if(!existUser) reply.code(404).send('User not found')
  if (!bcrypt.compareSync(password, existUser.hashedPassword)) {
    reply.code(400).send('Passwords doesnt match')
  }
  reply.code(200).send(existUser)
}

module.exports = {
  createUser,
  loginUser
}