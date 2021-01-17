const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((response) => console.log('Database Conected'))
  .catch((err) => {
    console.log(err)
  })

module.exports = mongoose
