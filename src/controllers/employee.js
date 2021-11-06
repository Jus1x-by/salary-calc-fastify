const { v4: uuidv4 } = require('uuid')
const { DataDB } = require('../db/data')
const dataDb = new DataDB()
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')

const selectEmployeeS = async (req, reply) => {
  console.log('ITS WORK')
  reply.send(await dataDb.findAllEmployee('61849d27ec58a6679a4a2246'))
}

const selectEmployee = async (req, reply) => {
  
}

const createEmployee = async (req, reply) => {
  console.log('req.user', req.user);
  const customer = await dataDb.findUserById(req.user.id)
  console.log('customer', customer)
  reply.send(
    await dataDb.createEmployee({ 
      ...req.body, 
      custtomerId: customer._id 
    })
  )
}

module.exports = {
  selectEmployeeS,
  selectEmployee,
  createEmployee
}