const User = require('../models/user');
const bcrypt = require('bcrypt')
const Util = require('../utils');
const { ObjectId } = require('mongoose').Types;

const login = async(req, res) =>{
    try {
        const {phoneNumber, password} = req.body;

        const user = await User.findOne({phoneNumber});
        if(!user) return res.json({message: 'phone number doesnot exist'});

        const validPwd = await bcrypt.compare(password, user.password);
        if(!validPwd) return res.json({message: 'wrong password'});

        const accessToken = Util.generateAccessToken(user);

        return res.json({user: userDTO(user), accessToken});
    }catch(err) {
        console.log(err);
        return res.json({error: err.message});
    } 
}

const register = async(req, res) =>{
    try{
        const {phoneNumber} = req.body;
    
        const accountCheck = await User.findOne({phoneNumber});
        if(accountCheck)
            return res.json({message: 'phone number existed'});

        const user = await User.create(req.body);

        if(!user) return res.json({message: 'cannot create user'});
        
        return res.json({ user: userDTO(user) });
    }catch(err){
        console.log(err);
        return res.json({error: err.message});
    }
}

const changePassword = async(req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;

        const user = await User.findById(req.user._id);

        const validPwd = await bcrypt.compare(oldPassword, user.password);
        if(!validPwd) return res.json({message: 'wrong password'});
        
        const nUser = await User.findByIdAndUpdate(user._id, {password: newPassword});
        if(!nUser) return res.json({message: 'update password failed'})

        return res.json({message: 'update successfully'});
    }catch(err){
        console.log(err);
        return res.json({error: err.message});
    }
}

const getProfile = async(req, res) => {
    try {
        const user = await User.aggregate([
            {
                $match: {
                    _id: new ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                  from: 'devices',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'device'
                }
            },
            {
                $addFields: {
                  deviceCount: { $size: '$device' }
                }
            },
            {
                $project: {
                    password: 0,
                    device: 0
                }
            }
        ])
        
        return res.json({user: user[0]});
    }catch(err) {
        console.log(err);
        return res.json({error: err.message});
    }
}

const updateProfile = async(req, res) => {
    try {
        const {password, _id, ...body} = req.body;

        const user = await User.findByIdAndUpdate(req.user._id, body);
        if(!user) return res.json({message: 'update failed'});

        return res.json({message: 'update successfully'});
    }catch(err) {
        console.log(err);
        return res.json({error: err.message});
    }
}

const userDTO = (user) => {
    return {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

module.exports = { login, register, changePassword, getProfile, updateProfile }