import "dotenv/config"

import {app} from "./src/app.js"
const port = process.env.PORT | 3000;
app.listen(process.env.PORT , ()=>{
	console.log(`server is listening on: http://localhost:${port}`);
})

