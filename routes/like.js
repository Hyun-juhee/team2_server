var express = require('express');
var router = express.Router();

const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage')
const db = require('../module/pool');

// 파티 좋아요
router.post('/', async (req, res) => {
    const inputUserIdx = req.body.user_idx;
    const inputPartyIdx = req.body.party_idx;

    if(!inputUserIdx ||!inputPartyIdx){ 
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }
    else {
        const likeSelectQuery = 'SELECT * FROM `like` WHERE user_idx = ? AND party_idx = ?';    // 예약어
        const likeSelectResult = await db.queryParam_Arr(likeSelectQuery, [inputUserIdx, inputPartyIdx]);

            if(likeSelectResult.length != 0){  // 이미 좋아요가 등록 된 상태
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_LIKE_PARTY));   // 이미 좋아요 된 파티
        } else {    // 좋아요 등록
            const likeInsertQuery = 'INSERT INTO `like` (user_idx, party_idx) VALUES (?,?)';
            const likeInsertResult = await db.queryParam_Arr(likeInsertQuery, [inputUserIdx, inputPartyIdx]);

            if(!likeInsertResult) { // 좋아요 실패
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_LIKE_PARTY));   // 좋아요 실패
            } else{ // 파티의 총 좋아요 수 + 1
                const likeUpdateQuery = 'UPDATE party SET likeCount = likeCount + 1 WHERE party_idx = ?';
                const likeUpdateResult = await db.queryParam_Arr(likeUpdateQuery, [inputPartyIdx]);

                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIKE_PARTY)); // 좋아요 성공
            }
        }

    }
});



// 파티 좋아요 취소
router.delete('/', async (req, res) => {
    const inputUserIdx = req.body.user_idx;
    const inputPartyIdx = req.body.party_idx;

    if(!inputUserIdx ||!inputPartyIdx){ 
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }
    else {
        const likeSelectQuery = 'SELECT * FROM `like` WHERE user_idx = ? AND party_idx = ?';
        const likeSelectResult = await db.queryParam_Arr(likeSelectQuery, [inputUserIdx, inputPartyIdx]);

            console.log(likeSelectResult);

            if(likeSelectResult.length == 0){  // 이미 좋아요가 취소된 상태
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_UNLIKE_PARTY));   // 이미 좋아요 취소된 파티
        } else {    // 좋아요 취소
                const likeDeleteQuery = 'DELETE FROM `like` WHERE user_idx = ? AND party_idx = ?'
                const likeDeleteResult = await db.queryParam_Arr(likeDeleteQuery, [inputUserIdx, inputPartyIdx]);

            if(!likeDeleteResult) { // 좋아요 취소 실패
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_UNLIKE_PARTY));   // 좋아요 취소 실패
            } else{ // 파티의 총 좋아요 수 - 1
                const likeUpdateQuery = 'UPDATE party SET likeCount = likeCount - 1 WHERE party_idx = ?';
                const likeUpdateResult = await db.queryParam_Arr(likeUpdateQuery, [inputPartyIdx]);

                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UNLIKE_PARTY)); // 좋아요 취소 성공
            }
        }

    }
});


module.exports = router;