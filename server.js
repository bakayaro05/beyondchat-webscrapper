import express from 'express';
import articleRoute from './routes/articleRoute.js'


const PORT=5000
const app = express()
app.use(express.json())


app.get('/',(req,res)=>{

    res.sendStatus(200)//success. //html skeleton.
})

app.use('/articles',articleRoute)

app.listen(PORT,()=>{
     console.log(`Hi There, Server has started on : ${PORT}`)
})