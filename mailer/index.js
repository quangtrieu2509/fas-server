const nodemailer = require('nodemailer')

const Mailer = require('../configs/mailer.config')

module.exports = {

    sendEmail: async function(destination, subject, content, callback){

        try {
            const mailOptions = {
                to: destination,
                subject: subject, 
                text: content
            }

            const transporter = nodemailer.createTransport({
                host: Mailer.MAIL_HOST,
                port: Mailer.MAIL_PORT,
                auth: {
                  user: Mailer.EMAIL,
                  pass: Mailer.PASSWORD
                }
            })

            transporter.sendMail(mailOptions, callback)

        } catch (error) {
            console.log(error)
        }
    }
}
