var express = require('express');
var router = express.Router();
const pool = require('../../module/pool');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const responseMessage = require('../../module/utils/responseMessage');
const table = 'party';

partyDetail = {
    detail: async(party_idx)=>{
        const query = `SELECT * FROM ${table} WHERE party_idx = ${party_idx}`;
        const result = await pool.queryParam_None(query);

        console.log(result);
        if(!result){
            return{
                    code : statusCode.BAD_REQUEST,
                    json : utils.successFalse(statusCode.BAD_REQUEST, responseMessage.DETAIL_READ_FAIL)
            };
        }
        else if(result.length==0){
            return{
                code : statusCode.BAD_REQUEST,
                json : utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NO_PARTY)
            };
        }    
        return{
            code : statusCode.OK,
            json : utils.successTrue(statusCode.OK,responseMessage.DETAIL_READ_SUCCESS, result)
        };
        
    }
}
router.get('/:party_idx', async(req,res)=>{
    const party_idx = req.params.party_idx;

    console.log(party_idx);
    if(!party_idx){
        res.status(200)
        .send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE));
    }
    try{
        const {code,json} = await partyDetail.detail(party_idx);
        res.status(code).send(json);
    }
    catch(err){
        console.log(err);
        res.status(200)
        .send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR,responseMessage.DETAIL_READ_FAIL));
    }
});



module.exports = router;
