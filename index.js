import express from "express";
import 'dotenv/config';
import {authenticationMiddlewware} from "./middlewares/auth.middleware.js"
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/url.routes.js";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddlewware);
app.get('/', async (req, res)=>{
    return res.status(200).json(`Server is Healthy`)
})
app.use('/user' , userRouter);
app.use(urlRouter)
app.listen(PORT, () => {
    console.log(`Server is Up and Running on PORT: ${PORT}`);
})