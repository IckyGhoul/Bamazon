var mysql = require('mysql');
var inquirer = require('inquirer');
    

var connection = mysql.createConnection({
    host:'localhost',
    port:3306,

    user:'root',

    password:'japanxdhd777',
    database:'bamazon_db'

});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected as id ' + connection.threadId)
    makePurchase();

})

function makePurchase(){
    inquirer.prompt([
        {
            type:'input',
            message:'What is the ID of the item you would like to buy?',
            name:'checkinventory'
        }
    ]).then(function(answer){
        connection.query('SELECT * FROM products',function(err,res){
            var selectedItemID = answer.checkinventory;
            var selectedItem = parseFloat(answer.checkinventory) - 1
            console.log(res[selectedItem])
            if(answer.checkinventory > res.length){
                console.log('sorry we do not have any products with an item ID of ' + answer.checkinventory + ".")
                makePurchase();
            }else{
                console.log('The item you have selected is ' + res[selectedItem].product_name + '.')
            console.log('Each unit is $' + res[selectedItem].price)
                inquirer.prompt([
                    {
                     type:'input',
                     message: 'how many units would you like to buy?',
                     name:'desiredUnits'   
                    }
                ]).then(function(answer){
                    var itemsDesired = answer.desiredUnits
                    connection.query('SELECT * FROM products WHERE item_id =' + selectedItemID , function(err,res){
                        console.log(res)
                        var itemsLeft = res[0].stock_quantity 
                        if(itemsDesired>itemsLeft){
                            console.log('sorry we do not have that many units in stock')
                            makePurchase();
                        }else{
                            var itemPrice = res[0].price;
                            var total = itemPrice * itemsDesired
                            console.log("you're total is $" + total)
                            var originalStock = res[0].stock_quantity
                           var remainingStock = originalStock - itemsDesired
                           console.log('Remaining ' + res[0].product_name + 'Stock: ' + remainingStock)
                        //   connection.query("UPDATE products SET stock_quantity =" + remainingStock + "WHERE item_id = " + selectedItemID,function(err,result){
                        //      if (err) throw err;
                        //      console.log(result.affectedRows) 
                        //   })
                        }
                        
                    })
                })
            }
            
        })
    })
}