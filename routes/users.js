var express = require('express');
var router = express.Router();
const pool = require('../module/pool');
const utils = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const responseMessage = require('../module/utils/responseMessage');

user = {
  signup: async({id, pwd, name})=>{
    const fields = 'id, pwd, name';
    const table = 'user';
    const questions = `?, ?, ?`;
    // const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
    const values = [id, pwd, name];
   // const result = await pool.queryParam_Parse(query, values);
    const userDB = await pool.queryParam_None(`SELECT * FROM ${table} WHERE id = '${id}'`);
    if(!userDB){
      return{
        code: statusCode.BAD_REQUEST,
        json: utils.successFalse(statusCode.BAD_REQUEST,responseMessage.SIGNUP_FAIL)
      };
    }
    else if(userDB.length > 0){
      return{

        code : statusCode.BAD_REQUEST,
        json : utils.successFalse(statusCode.BAD_REQUEST,responseMessage.ALREADY_EXIST_USER)
      }
    }

    // insert를 여기서 해줘야돼! if문으로 다 체크하고나서
    const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
    await pool.queryParam_Parse(query, values);
  
    return{
      code: statusCode.OK,
      json: utils.successTrue(statusCode.OK, responseMessage.SIGNUP_SUCCESS)
    }
  },

  signin : async({id, pwd})=>{
    const table = 'user';
    const query = `SELECT * FROM ${table} WHERE id = '${id}'`;
    const userArray = await pool.queryParam_None(query);
    const user = userArray[0];
    if(!user){
      return{
        code: statusCode.BAD_REQUEST,
        json: utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NO_USER)
      };
    }
    if(user.pwd != pwd){
      return{
        code : statusCode.BAD_REQUEST,
        json : utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NOT_CORRECT_PASSWORD)
      };
    }
    return{
      code : statusCode.OK,
      json : utils.successTrue(statusCode.OK, responseMessage.SIGNIN_SUCCESS)
    }
  }
}
router.post('/signup', async (req, res)=>{
  const {id, pwd, name} = req.body;
  if(!id || !pwd || !name){
    res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.NULL_VALUE));
  }
  try {
    const {code, json} = await user.signup({id, pwd, name});
    res.status(code).send(json);
  }catch(err){
    console.log(err);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.SIGNUP_FAIL));
  }
})
router.post('/signin', async (req, res)=>{
  const {id, pwd} = req.body;
  if(!id || !pwd){
    res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.NULL_VALUE));
  }
  try {
    const {code, json} = await user.signin({id, pwd});
    res.status(code).send(json);
  }catch(err){
    console.log(err);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.SIGNIN_FAIL));
  }
})

module.exports = router;
