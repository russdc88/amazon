# Bamazon 

## Setting up SQL

To start off, I created two files, the `schema.sql` and the `seed.sql` files.

#### `schema.sql`

In my code, I created code where if i have an existing database that I drop it and make a new. I have it set up that way for testing purposes. I then created my table **products** with the following columns:

- *item_id*: id number (which is the primary key) that auto increments from 1, 2, etc.

- *product_name*: name of the product.

- *department_name*: department the product belongs too.

- *price*: listed price of the product.

- *stock_quantity*: how many items were in stock.


#### `seed.sql`

You will see in the file. I have inserted 10 rows of data for the table **products**. 

After I made these, I ran mysql server and I grabbed both codes and ran them.


## Setting up my Javascript file `bamazonCustomer.js`

I first require two node packages called and defined them:

    var mysql = require("mysql");
		var inquirer = require("inquirer");

Then used *mysql* node package to set up a connecton to the mysql server and started the connection:

```
var connection = mysql.createConnection({
	host: "localhost",

	// Port; if not 3306
	port: 3306,

	// Username
	user: "root",

	// Password
	password: "",
	database: "bamazon"
});

//Start the connection while running new function

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	displayProducts();
});

```
Then the function `displayProducts()` was made that display all the data we have from the table **products**. It is used as a callback function.

Made a query in which selected everything and then ran a for loop for each row of data and console logged it so that it can be shown and appeared organized.

Here is the code:

```
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

			firstPrompt()
	});
}
```

The results from that code:

![Example 1](/images/example1.png)


Then the `firstPrompt` function is created and used as a callback. 

We first have a couple prompts being used for the user to request the product by id and how many they want:

```
inquirer
		.prompt([{
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

```

After the prompts are done, we will then make a condition in which the quantity has to be positive, else it will reset and go back to the orginal prompt. Also it will reset if the request amount is higher than the total quantity of the item. We then make a sql request and select the row with the specific id the user requested. Then it will subtract the total quantity availabe and subtract by the requested amount.

```
.then(function (answer) {
			if (answer.quantity < 0) {
				console.log("Please try again.")
				firstPrompt()
			}
			else {
				var query = "SELECT * FROM products WHERE ?";
				connection.query(query, { item_id: answer.productNumber }, function (err, res) {

					if (res[0].stock_quantity < answer.quantity) {
						console.log("Request too high, please Try again!")
						firstPrompt()
					}

					else {

						var newQuantity = res[0].stock_quantity - answer.quantity
```

Another sql request is made and the the row is updated with the new quantity available for that item. Then a new function `option` will be called:

```
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
								console.log("Success, you bought " + answer.quantity + " items! That will be $" + (answer.quantity*res[0].price) + ". Enjoy the " + res[0].product_name + "!")
								option()
							})
					}
				});
			}
		});

}
```

We then make the callback function `option` in which will give you options of continuing to shop or end the shopping by using prompts and condition statements. If continued, the `displayProduct` function will rerun and restart the whole process. If not continued, the the connection will end:

```
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

```

the results will look as followed:

![Example 2](/images/example2.png)
