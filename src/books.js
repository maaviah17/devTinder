// this just to practice the CRUDs
const express = require("express");
const app = express();

app.use(express.json());

let books = [
    { id: 1, title: "Book A" },
    { id: 2, title: "Book B" }
];

app.post("/books", (req,res)=>{
    const newBook = req.body;
    books.push(newBook);
    res.send("Book added");
})

app.get("/books", (req,res)=>{
    res.json(books);
})

app.get("/books/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id == id);
    res.json(book);
})

app.delete("/books/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    books = books.filter( b => b.id !== id);
    res.send("Book deleted");
})





app.post("/booking", (req,res)=>{
    const newBook = req.body;
    books.push(newBook);
    res.send("book added")
})

app.get("/booking", (req,res)=>{
    res.json(books);
    console.log("got all books");
})

app.get("/booking/:id", (req,res)=>{
    const id = parseInt(req.params.id)
    const book = books.find(b=> b.id == id)
    res.json(book)
})

PORT = 3010;
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})