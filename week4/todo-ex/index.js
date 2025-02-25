const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const FILE_PATH = './todo.json'; // Path to your JSON file

// Helper function to read data from JSON file
const readData = () => {
  if (!fs.existsSync(FILE_PATH)) return {tasks: []};
  const data = fs.readFileSync(FILE_PATH);
  console.log(JSON.parse(data).tasks);
  return JSON.parse(data);
};

// readData();

// Helper function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// GET Route: Fetch all data
app.get('/todo', (req, res) => {
  const data = readData();
  res.json(data.tasks);
});

// POST Route: Add new data
app.post('/todo', (req, res) => {
  const newItem = req.body;

  if ( !("isComplete" in newItem) || !("name" in newItem)) {
    return res.status(400).json({ error: 'Invalid data. Must include taskstatus and name.' });
  }

  const data = readData();
  let id = data.tasks.length + 1;
  newItem['id'] = id;
  data.tasks.push(newItem);
  writeData(data);

  res.status(201).json({ message: 'Item added successfully', data: newItem });
});

// PUT Route: Update data by ID
app.put('/todo/:id', (req, res) => {
  
  
  const updatedItem = req.body;
  const itemId = parseInt(req.params.id);
//   console.log(iid);
// const itemId = req.body.id;

  if (!("isComplete" in updatedItem) || !("name" in updatedItem)) {
    return res.status(400).json({ error: 'Invalid data. Must include name.' });
  }

  const data = readData();
  const index = data.tasks.findIndex((item) => item.id === itemId);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  data.tasks[index] = { ...data.tasks[index], ...updatedItem };
  writeData(data);

  res.json({ message: 'Item updated successfully', data : data.tasks[index] });
});

// Route to delete an item by ID
app.delete('/todo/:id', (req, res) => {
    // console.log(req.params);
    const itemId = parseInt(req.params.id,10);  // Extracting the item ID from the URL
    // console.log(itemId);
    

    let data = readData();
    let tasks = data.tasks;
    const initialLength = tasks.length;

    // Remove the item from the array
    const updatedTasks = tasks.filter(task => task.id !== itemId);

    // console.log(data.tasks);

    if (updatedTasks.length === initialLength) {
        return res.status(404).send('Item not found');
    }

    // console.log(data.tasks);
    data.tasks = updatedTasks;
    // writeData(data);

    res.status(200).json({ message: 'Item deleted successfully'});

    
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
