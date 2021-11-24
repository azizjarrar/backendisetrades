/**
 * check required params
 * @constructor
 */
module.exports=function validexistence(data,shouldexis,res){
    var error=false;
    for (let i in shouldexis) {
        if(data[shouldexis[i]]==undefined){
            error=true,
            res.status(res.statusCode).json({
                error:true,
                message: `${shouldexis[i]}  was required `,
  
              });
              return true
        }
    }
    return error
}
