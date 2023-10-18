const mqtt = require('mqtt')
const { ObjectId } = require('mongoose').Types
const uuid = require('uuid')

const MQTTBroker = require('../configs/mqtt.config')
const Device = require('../src/models/device')
const Param = require('../src/models/param')
const sendWarningMail = require('../mailer/warningMail')

function getMQTTClient(clientId){
    const client = mqtt.connect(
        `mqtt://${MQTTBroker.HOST}:${MQTTBroker.PORT}`, {
        clientId: clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
    })
    return client
}

function use(){
    const client = this.getMQTTClient(uuid.v4())
    const [DataTopic, StateTopic] = [MQTTBroker.DATA_TOPIC, MQTTBroker.STATE_TOPIC]

    client.on('connect', () => {
        console.log(`Connected to Broker ${MQTTBroker.HOST} port ${MQTTBroker.PORT}.`)
        client.subscribe([DataTopic, StateTopic], () => {
          console.log(`Subscribed to topic ${DataTopic} and ${StateTopic}.`)
        })
    })
      
    client.on('message', async function(topic, payload){
        try {
            if(topic == DataTopic){
                // Lấy dữ liệu
                const data = JSON.parse(payload.toString())
                const { deviceId, temp, fire, gas, warning, preWarning} = data

                // console.log('------------------------------------')
                // console.log(`Recieve data from ${deviceId}:`)
                // console.log(`\t- Temp: ${temp}\n\t- Fire: ${fire}\n\t- Gas: \t${gas}`)
                // console.log(`\t- PreWarning: ${preWarning}\n\t- Warning: ${warning}\n`)
                
                if(Boolean(warning) && Boolean(warning) !== Boolean(preWarning)){
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
                if(!newParams) console.log('Save data of params to database failed.')
            }
            
            if(topic == StateTopic){
                // Cập nhật trạng thái mới trên cơ sở dữ liệu
                const data = JSON.parse(payload.toString())
                const { state, deviceId } = data
                
                console.log (deviceId, '------',  state)

                // Update vào db
                const device = await Device.findOneAndUpdate({ _id: deviceId }, { state })
                if(!device) console.log('Update system state failed.')

            }
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = {getMQTTClient, use}