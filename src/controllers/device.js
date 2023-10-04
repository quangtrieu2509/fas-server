const Device = require('../models/device')
const mqtt = require('../../mqtt')
const brokerInfo = require('../../configs/mqtt.config')

const create = async(req, res) => {
    const data ={
        name: 'Nhà Tạ Quang Bửu',
        state: false,
        userID: '6400639f35f132cce1d3fe22'
    }

    const d = await Device.create(data)
    return res.json(d)
}


const getAllDevices = async(req, res) =>{
    try {
        const devices = await Device.find({userId: req.user._id})
        return res.json(devices)
    }catch(err) {
        console.log(err)
        return res.json({error: err.message})
    } 
}

const getDevice = async(req, res) => {
    try {
        const device = await Device.findOne({ _id: req.params.id, userId: req.user._id })

        if(!device) 
            return res.json({error: 'Bạn không có quyền truy cập'})

        return res.json(device)

    }catch(err) {
        console.log(err)
        return res.json({error: err.message})
    }
}

const updateDevice = async(req, res) => {
    try {
        const {name, state} = req.body
        const device = await Device.findOne({ _id: req.params.id, userId: req.user._id })

        if(!device) 
            return res.json({error: 'Bạn không có quyền truy cập'})

        if(name) {
            const uDevice = await Device.findByIdAndUpdate(device._id, { name })
            if(!uDevice)
                return res.json({error:'Cập nhật thất bại'})
        }

        if(state !== undefined && device.state != state ) {
            const client = mqtt.getMQTTClient()
            const message = {
                deviceId: device._id.toString(),
                state: state,
            }
            client.publish(brokerInfo.COMMAND_TOPIC, JSON.stringify(message), {qos: 0, retain: false}, async (err) => {
                if(err){
                    console.error(err)
                    await Device.findByIdAndUpdate(device._id, { state: device.state })
                }
                
                console.log(message)
            })

            // update to db
            const uDevice = await Device.findByIdAndUpdate(device._id, { state })
            if(!uDevice) console.log('Update system state failed!')
        }
        
        return res.json({message: 'Cập nhật thành công'})
    }catch(err) {
        console.log(err)
        return res.json({error: err.message})
    }
}

module.exports = { getAllDevices, getDevice, updateDevice, create }