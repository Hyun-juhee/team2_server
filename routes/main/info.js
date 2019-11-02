var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


// 회원정보 조회
router.get('/', async (req, res) => {
    const infoSelectQuery = 'SELECT * FROM party ORDER BY likeCount DESC LIMIT 1'; 
    const infoSelectResult = await db.queryParam_None(infoSelectQuery);

    console.log(infoSelectResult);

    if(!infoSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_MONTH_PARTY, infoSelectResult));      // 이달의 행사 조회 성공
    }
});

module.exports = router;