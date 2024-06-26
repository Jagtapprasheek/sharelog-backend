const express = require('express');
const app = express();


const port = process.env.PORT || 8081
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.get('/', (req, res) => {
    return res.status(200).json({ message  : "Welcome to ShareLog"});
})