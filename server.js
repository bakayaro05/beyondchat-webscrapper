import express from 'express';


const PORT=5000
const app = express()
app.use(express.json())



app.listen(PORT,()=>{
     console.log(`Hi There, Server has started on : ${PORT}`)
})