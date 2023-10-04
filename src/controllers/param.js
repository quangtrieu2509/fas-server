const Device = require('../models/device')
const Param = require('../models/param')


const getParams = async(req, res) => {
    try {
        const id = req.params.id
        const device = await Device.findById({ _id: req.params.id, userId: req.user._id })

        if(!device) 
            return res.json({message: 'you are not allowed to access'})
        else if(!device.state)
            return res.json({message: 'device is off now'})
      
        const params = await Param.find({deviceID: id}).sort({ createdAt: -1 }).limit(1)
        return res.json(params[0])
    }catch(err) {
        console.log(err)
        return res.json({error: err.message})
    }
}

module.exports = { getParams }