const EAPI = process.env.EAPI || "/api/v1";
const SERVER_PORT = process.env.SERVER_PORT!;

const saltRounds = parseInt(process.env.SALTROUNDS!) || 10;
const enviroment = process.env.ENVIRONMENT;

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const SECRET_KEY = process.env.SECRET_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_SECRET_KEY_REFRESH = process.env.JWT_SECRET_KEY_REFRESH;

const JWT_TIMEOUT = process.env.JWT_TIMEOUT;
const JWT_TIMEOUT_REFRESH = process.env.JWT_TIMEOUT_REFRESH;

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;


export {
  EAPI,
  SERVER_PORT,
  //----
  enviroment,
  saltRounds,
  //------
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  //------
  SECRET_KEY,
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_REFRESH,
  //--------
  JWT_TIMEOUT,
  JWT_TIMEOUT_REFRESH,
  //----------
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,

};
