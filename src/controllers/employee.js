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
  const { id } = req.params
  reply.send(await dataDb.findUserById(id))
}

const createEmployee = async (req, reply) => {
  const customer = await dataDb.findUserById(req.user.id)
  const { hourlyRate, hoursWorked, overtime } = req.body
  reply.send(
    await dataDb.createEmployee({ 
      ...req.body, 
      customerId: customer._id,
      totalEarned: hourlyRate * (hoursWorked + overtime * 1.5)
    })
  )
}

const updateEmployee = async (req, reply) => {
  const existEmployee = await dataDb.findUserById(req.body.id);
  if (!existEmployee) {
    reply.code(404).send(new Error('Not found | Employee'))
  }
  const fields = Object.keys(req.body)
  for (const field of fields) {
    if (field !== 'id' && existEmployee.hasOwnProperty(field)) {
      existEmployee[field] = req.body[field]
    } 
  }
  existEmployee.totalEarned = existEmployee.hourlyRate * (existEmployee.overtime * 1.5 + existEmployee.hoursWorked)
  reply.send(
    await dataDb.updateEmployee(existEmployee) 
  )
}

module.exports = {
  selectEmployeeS,
  selectEmployee,
  createEmployee,
  updateEmployee
}