const express = require("express");
require("dotenv").config();
const routeV1 = require("./src/routes/v1");
const db = require("./database");
const morgan = require("morgan");
const mqtt = require('./mqtt');
const Param = require('./src/models/param')
const cron = require('node-cron');
const cors = require('cors')
const { sendEmail } = require("./mailer");
const sendWarningMail = require("./mailer/warningMail")

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors())

// connect db mongo
db.connect();

// connect mqtt
mqtt.use();

// sendWarningMail("64fcaa0bf0a643123fe42d5f")
// sendEmail('trieuvipkute99@gmail.com', 'CẢNH BÁO CHÁY', 'Cháy kìa', (err, info)=>{
//     if(err) throw err
//     console.log('Send mail: ', info.response);
// })

// Đặt lịch xóa dữ liệu ngày hôm trước vào đúng 0h sáng mỗi ngày
const task = cron.schedule('59 23 * * *', async () =>  {
    await Param.deleteMany({}, (err)=>{
        if(!err) console.log('Delete Successfully!');
        else console.log('Delete Failed!');
    });
  }, {
    scheduled: false,
});
  
task.start();

app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.json());  // for parsing application/json

// app.use(morgan('combined'));
app.use('/fas/v1', routeV1)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}!`);
})