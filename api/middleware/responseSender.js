
  /**
 * send response
 * @constructor
 */
module.exports=function responseSender(res,object){
    res.status(res.statusCode).json({...object});
}