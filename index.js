import express from "express";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.get('/', async (req, res)=>{
    return res.status(200).json(`Server is Healthy`)
})

app.listen(PORT, () => {
    console.log(`Server is Up and Running on PORT: ${PORT}`);
})