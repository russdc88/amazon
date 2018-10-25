//requiring the two node packages mysql and inquirer.

var mysql = require("mysql");
var inquirer = require("inquirer");

// creating the connection information for the sql database
var connection = mysql.createConnection({
	host: "localhost",

	// Port; if not 3306
	port: 3306,

	// Username
	user: "root",

	// Password, please enter your own.
	password: "",
	database: "bamazon"
});

//Start the connection
connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	displayProducts();
});



//Display all the products using a sql request and a for loop
function displayProducts() {
	connection.query("SELECT * FROM products", function (err, res) {
		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
			console.log("Product Number: " + res[i].item_id)
			console.log("Product: " + res[i].product_name)
			console.log("Department: " + res[i].department_name)
			console.log("Price: $" + res[i].price)
			console.log("In Stock: " + res[i].stock_quantity)
			console.log("\n ---------------------- \n")
		}



		// callback function
		firstPrompt()
	});
}

//function in which returns two prompts requesting the item and the quantity of the item.

function firstPrompt() {
	inquirer
		.prompt([{
			//Which product prompt, selected by id.
			name: "productNumber",
			type: "input",
			message: "Select Product above by Product Number: ",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},

		//Quantity prompt
		{
			name: "quantity",
			type: "input",
			message: "How many would you like?",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}])
		.then(function (answer) {
			//make sure the quantity number is nonnegative
			if (answer.quantity < 0) {
				console.log("Please try again.")
				firstPrompt()
			}
			//selecting the specific row
			else {
				var query = "SELECT * FROM products WHERE ?";
				connection.query(query, { item_id: answer.productNumber }, function (err, res) {
					//if the requested amount is higher than the actual amount of the item
					if (res[0].stock_quantity < answer.quantity) {
						console.log("Request too high, please Try again!")
						firstPrompt()
					}

					else {
						//return new quantity after removing requested amount
						var newQuantity = res[0].stock_quantity - answer.quantity
						//update the sql table with the new quantity
						connection.query("Update products SET ? WHERE?",
							[
								{
									stock_quantity: newQuantity
								},
								{
									item_id: answer.productNumber
								}
							],
							function (err) {
								if (err) throw err;
								console.log("Success, you bought " + answer.quantity + " items! That will be $" + (answer.quantity * res[0].price) + ". Enjoy the " + res[0].product_name + "!")
								option()
							})
					}
				});
			}
		});

}

//Create options if they want to continue to shop or not
function option() {
	inquirer
		.prompt(
			{
				name: "option",
				type: "rawlist",
				message: "Would you like to continue to shop?",
				choices: ["yes", "no"]
			}
		)
		.then(function (answer) {
			if (answer.option === "yes") {
				displayProducts();
			}

			else {
				console.log("Thank you for shopping with us at Bamazon, now get the hell out of here!")
				connection.end()
			}
		})
}


