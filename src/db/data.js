const { createConnection } = require('../db/mongo');
const bcrypt = require('bcrypt')

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
    const connection = await this.getConnection()
    return await connection.findOne({
      '_id': `ObjectId("${id}")`
    })
  }

  async getStepInputData(stepNumber) {
    const connection = await this.getConnection()
    const data = await connection.findOneAndUpdate(
      {
        step: `${stepNumber}`,
        finished: false,
      },
      {$set: {finished: true}},
      {returnOriginal: false});

    return data.value;
  }

  async insertStepData(sourceId, stepNumber, dataList) {
    const connection = await this.getConnection();
    const insert = dataList.map(data => ({
      data: data,
      step: `${stepNumber}`,
      finished: false,
      sourceId: sourceId,
    }));
    await connection.insertMany(insert);
  }

  async getStepData(stepIndex) {
    const connection = await this.getConnection();
    return connection.find({
      step: `${stepIndex}`,
    }).toArray();
  }

  async getDataList(objectIds) {
    const connection = await this.getConnection();
    return connection.find({
      _id: { $in: objectIds },
    }).toArray();
  }

  async findAllEmployee(userId) {
    const connection = await this.getConnection();
    return await connection.find({
      sourceId: userId
    }).toArray()
  }

  async createEmployee(employee) {
    const connection = await this.getConnection();
    const data = await connection.insertOne(employee)
    console.log('data', data);
    return await connection.findOne({ 
      _id: data.insertedId
    });
  }

}

module.exports = {
  DataDB,
}