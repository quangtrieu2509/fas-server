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
        mailer.sendEmail(device[0].user[0].email, 'CẢNH BÁO CHÁY', content, (err, info)=>{
            // if err, server die, fix it!!!!
            if(err) throw err
            console.log('Send mail: ', info.response)
        })
    } catch (error) {
        console.log(error)
    }

}