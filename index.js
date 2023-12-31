const express = require('express')
const schedule = require('node-schedule');
const cors = require('cors')
// const morgan = require('morgan')
require('dotenv').config()

const routeV1 = require('./src/routes/v1')
const db = require('./database')
const mqtt = require('./mqtt')
const Param = require('./src/models/param')
// const { sendEmail } = require('./mailer')
// const sendWarningMail = require('./mailer/warningMail')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

// connect db mongo
db.connect()

// connect mqtt
mqtt.use()

// sendWarningMail('64fcaa0bf0a643123fe42d5f')
// sendEmail('trieuvipkute99@gmail.com', 'CẢNH BÁO CHÁY', 'Cháy kìa', (err, info)=>{
//     if(err) throw err
//     console.log('Send mail: ', info.response)
// })

// Đặt lịch xóa dữ liệu ngày hôm trước vào đúng 0h sáng mỗi ngày
schedule.scheduleJob('59 23 * * *', () => {
  Param.deleteMany({})
    .then(() => {
        console.log('Schedule delete Successfully.')
    })
    .catch(() => {
        console.log('Schedule delete Failed.')
    });
});

app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use(express.json())  // for parsing application/json

// app.use(morgan('combined'))
app.use('/fas/v1', routeV1)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}.`)
})