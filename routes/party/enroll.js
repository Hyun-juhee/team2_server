var express = require('express');
var router = express.Router();
const moment = require('moment');

const upload = require('../../config/multer');

const pool = require('../../module/pool');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const responseMessage = require('../../module/utils/responseMessage');
const table = 'party';

partyEnroll = { //creatAt,,?
    enroll : async({image, title, date, address, content, please, host, createdAt})=>{
        const fields = 'image, title, date, address, content, please, host, createdAt';
        const table = 'party';
        const questions = '?,?,?,?,?,?,?,?';
        const values = [image, title, date, address, content, please, host, createdAt];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        const result = await pool.queryParam_Parse(query,values);

        if(!result){
            return{
                code: statusCode.BAD_REQUEST,
                json: utils.successFalse(statusCode.BAD_REQUEST,responseMessage.ENROLL_FAIL)
            };
        }
        return{
            code : statusCode.OK,
            json : utils.successTrue(statusCode.OK,responseMessage.ENROLL_SUCCESS)
        };
    }
}

router.post('/', upload.single('image'), async(req,res)=>{
    const {title, date, address, content, please, host} = req.body;
    const image = req.file.location;
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    if(!image || !title || !date || !address || !content || !please || !host ||!createdAt){
        res.status(statusCode.BAD_REQUEST)
        .send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    }try {
        const {code, json} = await partyEnroll.enroll({image, title, date, address, content, please,host, createdAt})
        res.status(code).send(json);
    }catch(err)
    {
        console.log(err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.ENROLL_FAIL));
    }
})
module.exports = router;
