require('dotenv').config()

module.exports = {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: Number(process.env.MAIL_PORT),
    EMAIL: process.env.MAIL_EMAIL,
    PASSWORD: process.env.MAIL_PASSWORD
}