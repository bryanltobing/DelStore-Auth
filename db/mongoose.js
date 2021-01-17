const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost:27017/delstore-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((response) => console.log('Database Conected'))
  .catch((err) => {
    console.log(err)
  })

module.exports = mongoose
