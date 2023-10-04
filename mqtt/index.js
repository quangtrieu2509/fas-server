const mqtt = require('mqtt')
const { ObjectId } = require('mongoose').Types

const MQTTBroker = require('../configs/mqtt.config')
const Device = require('../src/models/device')
const Param = require('../src/models/param')
const sendWarningMail = require('../mailer/warningMail')

function getMQTTClient(){
    const client = mqtt.connect(
        `mqtt://${MQTTBroker.HOST}:${MQTTBroker.PORT}`, {
        clientId: MQTTBroker.CLIENT_ID,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
    })
    return client
}

function use(){
    const client = this.getMQTTClient()
    const [DataTopic, StateTopic] = [MQTTBroker.DATA_TOPIC, MQTTBroker.STATE_TOPIC]

    client.on('connect', () => {
        console.log(`Connected to Broker ${MQTTBroker.HOST} port ${MQTTBroker.PORT}`)
        client.subscribe([DataTopic, StateTopic], () => {
          console.log(`Subscribed to topic ${DataTopic} and ${StateTopic}`)
        })
    })
      
    // Xử lý dữ liệu gửi tới
    client.on('message', async function(topic, payload){
        try {
            // Nếu phần cứng gửi dữ liệu lên
            if(topic == DataTopic){
                // Lấy dữ liệu
                const data = JSON.parse(payload.toString())
                const { deviceId, temp, fire, gas, warning} = data

                console.log('------------------------------------')
                console.log(`Recieve data from ${deviceId}: \n\t- Temp: ${temp}\n\t- Fire: ${fire}\n\t- Gas: \t${gas}\n`)
                
                if(Boolean(warning)){
                    await sendWarningMail(deviceId)
                }

                const params = { 
                    fire: +fire, 
                    temp: (+temp).toFixed(2), 
                    gas: +gas,
                    deviceId: new ObjectId(deviceId),
                    warning: Boolean(warning) 
                }
                // Lưu dữ liệu vào db
                const newParams = await Param.create(params)
                if(!newParams) console.log('save data of params to database failed')
            }
            
            // Nếu phần cứng báo cáo thay đổi trạng thái
            if(topic == StateTopic){
                // Cập nhật trạng thái mới trên cơ sở dữ liệu
                const data = JSON.parse(payload.toString())
                const { state, deviceId } = data
                
                console.log (deviceId, ' ---+++++---',  statetate)

                // Update vào db
                const device = await Device.findOneAndUpdate({ _id: deviceId }, { state })
                if(!device) console.log('Update system state failed!')

            }
        } catch (error) {
            console.log(error)
        }
 
    })
}

module.exports = {getMQTTClient, use}