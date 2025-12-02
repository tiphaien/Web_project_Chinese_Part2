const express = require('express');
const cors = require('cors');
const items = require('./data/items'); // import the data array from the data folder


const app = express();
app.use(cors());
app.use(express.json());


const totalItems = items.length;
let currentIndex = 0; // in-memory pointer to the "current" item




// This step : response must include: - current index - item object - total number of items 

function makeResponse(index) {
return {
currentIndex: index,
totalItems: totalItems,
item: items[index]
};
}


//To create API endpoints :

// GET /item - return current item
app.get('/item', (req, res) => {
res.json(makeResponse(currentIndex));
});


// GET /item/next - move to next item (wraps)
app.get('/item/next', (req, res) => {
currentIndex = (currentIndex + 1) % totalItems;
res.json(makeResponse(currentIndex));
});


// GET /item/prev - move to previous item (wraps)
app.get('/item/prev', (req, res) => {
currentIndex = (currentIndex - 1 + totalItems) % totalItems;
res.json(makeResponse(currentIndex));
});


// GET /item/:id - return item by index (0-based)
app.get('/item/:id', (req, res) => {
const id = Number(req.params.id);
if (Number.isNaN(id) || id < 0 || id >= totalItems) {
return res.status(400).json({ error: 'Invalid index. Provide a number between 0 and ' + (totalItems - 1) });
}
currentIndex = id; // optional: update current index to this id
res.json(makeResponse(currentIndex));
});


// health
app.get('/', (req, res) => res.send('Backend running. Use /item endpoints.'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));