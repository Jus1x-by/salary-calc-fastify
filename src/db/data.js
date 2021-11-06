const { createConnection } = require('../db/mongo');
const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');

class DataDB {

  async getConnection() {
    if (!DataDB._connection) {
      DataDB._connection = await createConnection();
    }

    return DataDB._connection.db('salary-calc').collection('records');
  }

  async createUser({ email, password, firstName, lastName }){
    const connection = await this.getConnection()
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    const data = await connection.insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })

    return await connection.findOne({ email: email });
  }

  async findUser(email){
    const connection = await this.getConnection()
    return await connection.findOne({
      email: email
    })
  }

  async findUserById(id){
    console.log('id', id)
    const connection = await this.getConnection()
    return await connection.findOne({
      _id: ObjectId(id)
    })
  }

  async findAllEmployee(userId) {
    const connection = await this.getConnection()
    return await connection.find({
      customerId: ObjectId(userId)
    }).toArray()
  }

  async createEmployee(employee) {
    const connection = await this.getConnection()
    const data = await connection.insertOne(employee)
    return await connection.findOne({ 
      _id: data.insertedId
    })
  }

  async updateEmployee(employee) {
    const connection = await this.getConnection()
    await connection.updateOne({ _id: employee._id }, {
      $set: employee,
    })
    return await this.findUserById(employee._id);
  }

}

module.exports = {
  DataDB,
}