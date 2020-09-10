import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './app/models';



dotenv.config();

const PORT = process.env.PORT || 8080;
const corsOptions = {
	origin: 'http:localhost:8080'
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Re-sync DB');
});

app.get('/', (req, res) => {
	res.json({
		message: 'Node JS API Boilerplate'
	});
});

require("./app/routes/tutorial.routes")(app);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

export default app;
