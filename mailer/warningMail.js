const { ObjectId } = require('mongoose').Types

const mailer = require('./index')
const Device = require('../src/models/device')

module.exports = async function sendWarningMail(deviceId) {
    try {
        const device = await Device.aggregate([
            {
                $match: {
                    _id: new ObjectId(deviceId)
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'user'
                }
            }
        ])

        const content = 'Chúng tôi phát hiện thấy thông số bất thường trong nhà bạn. Vui lòng kiểm tra!'
        let retries = 3
        
        function sendEmail() {
            mailer.sendEmail(device[0].user[0].email, 'CẢNH BÁO CHÁY', content, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err)
                    if (retries !== 0) {
                        retries--
                        console.log(`Retry attempt ${retries} of 3.`)
                        sendEmail() // Retry sending the email
                    } else {
                        console.error('Max retries reached. Email could not be sent.')
                    }
                } else {
                    console.log('Send mail:', info.response)
                }
            });
        }
        
        sendEmail() // Initial email sending
        
    } catch (error) {
        console.log(error)
    }

}