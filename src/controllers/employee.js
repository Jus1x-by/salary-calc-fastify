const { v4: uuidv4 } = require('uuid')
const { DataDB } = require('../db/data')
const dataDb = new DataDB()
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')

const selectEmployeeS = async (req, reply) => {
  console.log('ITS WORK')
  reply.send(await dataDb.findAllEmployee(req.user.id))
}

const selectEmployee = async (req, reply) => {
  
}

const createEmployee = async (req, reply) => {
  const customer = await dataDb.findUserById(req.user.id)
  reply.send(
    await dataDb.createEmployee({ 
      ...req.body, 
      customerId: customer._id,
      totalEarned: req.body.hourlyRate * (req.body.hoursWorked + req.body.overtime * 1.5)
    })
  )
}

module.exports = {
  selectEmployeeS,
  selectEmployee,
  createEmployee
}