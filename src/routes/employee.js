const {
  selectEmployeeS,
  selectEmployee,
  createEmployee
} = require('../controllers/employee');

const { requireAuth } = require('../middlewares/reqAuth');

const {
  reqAuth
} = require('../plugins/reqAuth')

const Employee = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    position: { type: 'string' },
    hourlyRate: { type: 'number' },
    hoursWorked: { type: 'number' },
    overtime: { type: 'number' }
  }
}

const headersJwt = {
  type: 'object',
  required: ['Authorization'],
  properties: {
    Authorization: { type: 'string' }
  }
}

const getEmployeeS = {
  schema: {
    headers: headersJwt,
    response: {
      201: {
        type: 'array',
        items: Employee
      }
    },
  }
}

const getEmployee = {
  schema: {
    response: {
      200: Employee
    },
    headers: headersJwt,
  }
}

const postEmployee = {
  schema: {
    body: {
      type: 'object',
      required: ['firstName', 'lastName', 'position', 'hourlyRate', 'hoursWorked', 'overtime'],
      properties: Employee.properties
    },
    headers: headersJwt,
    response: {
      201: Employee
    }
  }
}

function employee(fastify, options, done) {

  // Many employee's
  fastify.get('/employees', { getEmployeeS, preHandler: requireAuth, handler: selectEmployeeS })
  // One employee
  fastify.get('/employee/:id', { getEmployee, preHandler: requireAuth, handler: selectEmployee })
  // Add employee
  fastify.post('/employee', { postEmployee, preHandler: requireAuth, handler: createEmployee} )

  done()

}

module.exports = employee;