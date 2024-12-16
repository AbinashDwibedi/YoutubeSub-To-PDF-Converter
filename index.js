import "dotenv/config"

import {app} from "./src/app.js"
app.listen(process.env.PORT , ()=>{
	console.log(`server is listening on: http://localhost:${process.env.PORT}`);
})

