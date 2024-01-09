const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;

  if(isAuthenticated({email, password}) === true) {
    const status = 401;
    const message = 'Email and Password already exist';
    res.status(status).json({status, message});
    return
  }

fs.readFile("./users.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    // Get current users data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var last_item_id = data.users[data.users.length-1].id;

    //Add new user
    data.users.push({id: last_item_id + 1, email: email, password: password}); //add some data
    var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
});

// Create token for new user
  const access_token = createToken({email, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;
  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }
  const access_token = createToken({email, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})


server.post('/products', (req, res) => {
  console.log("create product endpoint called; request body:");
  console.log(req.body);
  const { id, name, price, quantity, locationId, familyId } = req.body;

  // Check if required fields are provided
  if (!name || !price || !quantity || !locationId || !familyId) {
    const status = 400;
    const message = 'Name, price, quantity, locationId, familyId are required fields';
    res.status(status).json({ status, message });
    return;
  }

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    const newProductId = id || (existingData.products[existingData.products.length - 1]?.id || 0) + 1;

    // Add the new product
    existingData.products.push({ id: newProductId, name, price, quantity, locationId, familyId });

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(201).json({ id: newProductId, message: 'Product created successfully' });
    });
  });
});

// Custom route to search product by ID
server.get('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);

  if (isNaN(productId) || productId <= 0) {
    const status = 400;
    const message = 'Invalid product ID';
    res.status(status).json({ status, message });
    return;
  }

   // Use json-server's db to get the product by ID
  const product = router.db.get('products').find({ id: productId }).value();

  if (!product) {
    const status = 404;
    const message = 'Product not found';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json(product);
});

// Update Product
server.put('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const { name, price, quantity, locationId, familyId } = req.body;

  // Check if required fields are provided
  if (!name || !price || !quantity || !locationId || !familyId) {
    const status = 400;
    const message = 'Name, price, quantity, locationId, familyId are required fields';
    res.status(status).json({ status, message });
    return;
  }

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the product by ID
    const productIndex = existingData.products.findIndex(product => product.id === productId);

    // Check if the product exists
    if (productIndex === -1) {
      const status = 404;
      const message = 'Product not found';
      res.status(status).json({ status, message });
      return;
    }

    // Update the product
    existingData.products[productIndex] = { id: productId, name, price, quantity, locationId, familyId };

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: productId,name: name , message: 'Product updated successfully' });
    });
  });
});

server.delete('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the product by ID
    const productIndex = existingData.products.findIndex(product => product.id === productId);

    // Check if the product exists
    if (productIndex === -1) {
      const status = 404;
      const message = 'Product not found';
      res.status(status).json({ status, message });
      return;
    }

    // Remove the product from the array
    existingData.products.splice(productIndex, 1);

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: productId, message: 'Product deleted successfully' });
    });
  });
});

server.post('/locations', (req, res) => {
  console.log("create location endpoint called; request body:");
  console.log(req.body);
  const { id, name } = req.body;

  // Check if required fields are provided
  if (!name ) {
    const status = 400;
    const message = 'Name is required field';
    res.status(status).json({ status, message });
    return;
  }


  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    const newLocationId = id || (existingData.locations[existingData.locations.length - 1]?.id || 0) + 1;

    // Add the new location
    existingData.locations.push({ id: newLocationId, name });

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(201).json({ id: newLocationId, message: 'Location created successfully' });
    });
  });
});

// Custom route to search location by ID
server.get('/locations/:locationId', (req, res) => {
  const locationId = parseInt(req.params.locationId);

  if (isNaN(locationId) || locationId <= 0) {
    const status = 400;
    const message = 'Invalid location ID';
    res.status(status).json({ status, message });
    return;
  }

  const location = router.db.get('locations').find({ id: locationId }).value();

  if (!location) {
    const status = 404;
    const message = 'Location not found';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json(location);
});

// Update Location
server.put('/locations/:locationId', (req, res) => {
  const locationId = parseInt(req.params.locationId, 10);
  const { name } = req.body;

  // Check if required fields are provided
  if (!name) {
    const status = 400;
    const message = 'Name is required field';
    res.status(status).json({ status, message });
    return;
  }

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the location by ID
    const locationIndex = existingData.locations.findIndex(location => location.id === locationId);

    // Check if the location exists
    if (locationIndex === -1) {
      const status = 404;
      const message = 'Location not found';
      res.status(status).json({ status, message });
      return;
    }

    // Update the location
    existingData.locations[locationIndex] = { id: locationId, name};


    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: locationId, message: 'Location updated successfully' });
    });
  });
});

server.delete('/locations/:locationId', (req, res) => {
  const locationId = parseInt(req.params.locationId, 10);

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the location by ID
    const locationIndex = existingData.locations.findIndex(location => location.id === locationId);

    // Check if the location exists
    if (locationIndex === -1) {
      const status = 404;
      const message = 'Location not found';
      res.status(status).json({ status, message });
      return;
    }

    // Remove the location from the array
    existingData.locations.splice(locationIndex, 1);

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: locationId, message: 'Location deleted successfully' });
    });
  });
});


server.post('/families', (req, res) => {
  console.log("create family endpoint called; request body:");
  console.log(req.body);
  const { id, name } = req.body;

  // Check if required fields are provided
  if (!name ) {
    const status = 400;
    const message = 'Name is required field';
    res.status(status).json({ status, message });
    return;
  }


  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    const newFamilyId = id || (existingData.families[existingData.families.length - 1]?.id || 0) + 1;

    // Add the new family
    existingData.families.push({ id: newFamilyId, name});

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(201).json({ id: newFamilyId, message: 'Family created successfully' });
    });
  });
});

// Custom route to search family by ID
server.get('/families/:familyId', (req, res) => {
  const familyId = parseInt(req.params.familyId);

  if (isNaN(familyId) || familyId <= 0) {
    const status = 400;
    const message = 'Invalid family ID';
    res.status(status).json({ status, message });
    return;
  }

  const family = router.db.get('families').find({ id: familyId }).value();

  if (!family) {
    const status = 404;
    const message = 'Family not found';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json(family);
});

// Update Family
server.put('/families/:familyId', (req, res) => {
  const familyId = parseInt(req.params.familyId, 10);
  const { name } = req.body;

  // Check if required fields are provided
  if (!name) {
    const status = 400;
    const message = 'Name is required field';
    res.status(status).json({ status, message });
    return;
  }

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the family by ID
    const familyIndex = existingData.families.findIndex(family => family.id === familyId);

    // Check if the family exists
    if (familyIndex === -1) {
      const status = 404;
      const message = 'Location not found';
      res.status(status).json({ status, message });
      return;
    }

    // Update the family
    existingData.families[familyIndex] = { id: familyId, name};

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: familyId, message: 'Family updated successfully' });
    });
  });
});

server.delete('/families/:familyId', (req, res) => {
  const familyId = parseInt(req.params.familyId, 10);

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the family by ID
    const familyIndex = existingData.families.findIndex(family => family.id === familyId);

    // Check if the family exists
    if (familyIndex === -1) {
      const status = 404;
      const message = 'Family not found';
      res.status(status).json({ status, message });
      return;
    }

    // Remove the family from the array
    existingData.families.splice(familyIndex, 1);

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: familyId, message: 'Family deleted successfully' });
    });
  });
});

server.post('/transactions', (req, res) => {
  console.log("create transaction endpoint called; request body:");
  console.log(req.body);
  const { id, cost, quantity, productId } = req.body;

  // Check if required fields are provided
  if (!cost || !quantity || !productId) {
    const status = 400;
    const message = 'Cost, productId, and quantity are required fields';
    res.status(status).json({ status, message });
    return;
  }


  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    const newTransactionId = id || (existingData.transactions[existingData.transactions.length - 1]?.id || 0) + 1;

    // Add the new transaction
    existingData.transactions.push({ id: newTransactionId, cost, quantity, productId});

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(201).json({ id: newTransactionId, message: 'Transaction created successfully' });
    });
  });
});

// Custom route to search transaction by ID
server.get('/transactions/:transactionId', (req, res) => {
  const transactionId = parseInt(req.params.transactionId);

  if (isNaN(transactionId) || transactionId <= 0) {
    const status = 400;
    const message = 'Invalid transaction ID';
    res.status(status).json({ status, message });
    return;
  }

  const transaction = router.db.get('transactions').find({ id: transactionId }).value();

  if (!transaction) {
    const status = 404;
    const message = 'Transaction not found';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json(transaction);
});

// Update Transaction
server.put('/transactions/:transactionId', (req, res) => {
  const transactionId = parseInt(req.params.transactionId, 10);
  const { cost, quantity, productId } = req.body;

  // Check if required fields are provided
  if (!cost || !quantity || !productId) {
    const status = 400;
    const message = 'Cost, productId, and quantity are required fields';
    res.status(status).json({ status, message });
    return;
  }

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the transaction by ID
    const transactionIndex = existingData.transactions.findIndex(transaction => transaction.id === transactionId);

    // Check if the transaction exists
    if (transactionIndex === -1) {
      const status = 404;
      const message = 'Transaction not found';
      res.status(status).json({ status, message });
      return;
    }

    // Update the transaction
    existingData.transactions[transactionIndex] = { id: transactionId, cost, quantity, productId};

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: transactionId, message: 'Transaction updated successfully' });
    });
  });
});

server.delete('/transactions/:transactionId', (req, res) => {
  const transactionId = parseInt(req.params.transactionId, 10);

  // Read the existing data from 'database.json'
  fs.readFile('./database.json', (err, data) => {
    if (err) {
      const status = 500;
      const message = 'Internal Server Error';
      res.status(status).json({ status, message });
      return;
    }

    // Parse the existing data
    const existingData = JSON.parse(data.toString());

    // Find the transaction by ID
    const transactionIndex = existingData.transactions.findIndex(transaction => transaction.id === transactionId);

    // Check if the transaction exists
    if (transactionIndex === -1) {
      const status = 404;
      const message = 'Transaction not found';
      res.status(status).json({ status, message });
      return;
    }

    // Remove the transaction from the array
    existingData.transactions.splice(transactionIndex, 1);

    // Write the updated data back to 'database.json'
    fs.writeFile('./database.json', JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        const status = 500;
        const message = 'Internal Server Error';
        res.status(status).json({ status, message });
        return;
      }

      res.status(200).json({ id: transactionId, message: 'Transaction deleted successfully' });
    });
  });
});

server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})