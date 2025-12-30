import express from 'express';
import articleRoute from './routes/articleRoute.js'
import cors from 'cors'



const app = express()
app.use(express.json())
app.use(cors()) 

app.get('/',(req,res)=>{

    res.sendStatus(200)//success. //html skeleton.
})

app.use('/articles',articleRoute)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
