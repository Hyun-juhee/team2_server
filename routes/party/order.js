const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


// 인기순 파티 조회
router.get('/like', async (req, res) => {
    // const resAllData = [];

    const listSelectQuery = 'SELECT * FROM party ORDER BY likeCount DESC';  // 인기 내림차순
    const listSelectResult = await db.queryParam_None(listSelectQuery);

    console.log(listSelectResult);
    
    // for(let i = 0; i < listSelectResult.length; i++){
    //     let item = {
    //         info: ""
    //     }
    //     item.info.push(listSelectResult[i]);
    //     resAllData.push(item);
    // }

    if(!listSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_ORDER_LIKE, listSelectResult));    // 인기순 조회 성공
    }
});

// 최신순 파티 조회
router.get('/new', async (req, res) => {
    // const resAllData = [];

    const listSelectQuery = 'SELECT * FROM party ORDER BY createdAt DESC';    // 등록 내림차순
    const listSelectResult = await db.queryParam_None(listSelectQuery);

    console.log(listSelectResult);
    
    // for(let i = 0; i < listSelectResult.length; i++){
    //     let item = {
    //         info: []
    //     }
    //     item.info.push(listSelectResult[i]);
    //     resAllData.push(item);
    // }

    if(!listSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_ORDER_NEW, listSelectResult));    // 최신순 조회 성공
    }
});


module.exports = router; 