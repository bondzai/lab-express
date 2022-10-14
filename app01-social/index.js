const express = require(`express`)
const app = express()
const port = 4000 || process.env.port

app.get(`/`, (req, res) => {
    return res.send(`Hello World`)
})

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})