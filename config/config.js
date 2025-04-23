import dotenv from "dotenv";
dotenv.config();

const getConfigs = () => {
  return {
    morgan: {
      logStyle: "dev",
    },
    cors: {
      origin: ["*"],
      credentials: true,
    },
    server: {
      name: "Event",
      port: process.env.PORT || 2001,
      baseURl: "/",
      APP_URL: process.env.APP_URL,
    },
    mongo: {
      url: process.env.MONGO_URL,
    },
    jwt: {
      accessSecret: process.env.JWT_SECRET,
      accessOptions: {
        expiresIn: process.env.JWT_EXPIRES,
      },
    },
    mail: {
      port: process.env.SMTP_PORT,
      host: process.env.SMTP_HOST,
      userMail: process.env.SMTP_MAIL,
      userPass: process.env.SMTP_PASSWORD,
      cc_email_id: process.env.CC_EMAIL,
    },
    salt: {
      salt: process.env.SALT,
    },
    cookie: {
      cookie_expire: process.env.COOKIE_EXPIRE,
    },
  };
};

export default getConfigs;
