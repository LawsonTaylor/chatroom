const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')
const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: "",
  key: "",
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/user', (req, res) => {
  const { username } = req.body;

  chatkit.createUser({
    name: username,
    id: username,
  })
  .then(() => {
    res.sendStatus(201);
    console.log("sent!");
  })
  .catch(error => {
    if(error.error_type === '/services/chatkit/user_already_exists'){
      res.sendStatus(200)
    } else {
      console.log(error);
      res.status(error.status >= 100 && error.status < 600 ? error.status : 500);
    }
  })
})


const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
