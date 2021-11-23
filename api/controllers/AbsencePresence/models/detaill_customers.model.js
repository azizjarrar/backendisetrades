const sql=require('../../../../db_connection');

const DetaillCustomer=function (customer) {
    this.description=customer.description,
    this.id_customers=customer.id_customers;
    
};



DetaillCustomer.create=(newDetaillCustomer,result)=>{
    let resSql=null;
    sql.query('select * from customers',(err,res)=>{
        if(err){
            console.log("error:",err);
            result(err,null);
            return;
        }

        if(res.length){
            resSql=res;
            var resSql = Object.values(JSON.parse(JSON.stringify(resSql)));
            console.log(resSql.length);
            for (let index = 0; index < resSql.length; index++) {
                
                if(index==resSql.length-1){
                    result(null,{message:"success detaill_customers.model"});
                    return;
                }
                if(resSql[index].email=="test33"){
    
                    sql.query(`INSERT INTO detaill_customers (description,id_customers) values('my discription${index}','${resSql[index].id_coutomer}')`,(err,res)=>{
                        if(err){
                            console.log("error :",err);
                            result(err,null);
                            return;
                        }
                       

                    });




                }
                
            }


            result(null,res);
            return;
        }
        result({kind:"list empty"},null);
    });
    

/*
    sql.query("INSERT INTO detaill_customers SET ?",newDetaillCustomer,(err,res)=>{
        if(err){
            console.log("error :",err);
            result(err,null);
            return;
        }
        console.log("created detaill-customer",{id:res.insertId, ...newDetaillCustomer});
        result(null,{id:res.insertId, ...newDetaillCustomer});
    });
    return;*/
};




module.exports=DetaillCustomer;