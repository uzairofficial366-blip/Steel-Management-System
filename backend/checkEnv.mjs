import dotenv from 'dotenv'; const result = dotenv.config({ path: './.env' }); console.log(JSON.stringify(result, null, 2)); console.log(process.env.DATABASE_URL);
