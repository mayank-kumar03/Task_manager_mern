const express = require("express");
const { createTodo, updateTodo } = require("./src/middlewares/types"); 
const { connectDB, Todo } = require("./src/models/db");
const cors=require("cors");

const app = express();
app.use(express.json());
app.use(cors());


// Connect MongoDB
connectDB();

app.post("/todo", async function (req, res) {
    try {
        const createPayload = req.body;
        const parsedPayload = createTodo.safeParse(createPayload);

        if (!parsedPayload.success) {
            return res.status(411).json({ message: "You sent the wrong inputs" });
        }

        await Todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false
        });

        res.json({ msg: "Todo is created" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

app.get("/todos", async function (req, res) {
    try {
        const todos = await Todo.find({});
        res.json({ todos });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

app.put("/completed", async function (req, res) {
    try {
        const updatePayload = req.body;
        const parsedPayload = updateTodo.safeParse(updatePayload);

        if (!parsedPayload.success) {
            return res.status(411).json({ message: "You sent the wrong inputs" });
        }

        await Todo.updateOne(
            { _id: req.body.id },
            { $set: { completed: true } }
        );

        res.json({ msg: "Todo is completed" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// New route to remove completed todos
app.delete("/completed-todos", async function (req, res) {
    try {
        // Remove all todos marked as completed
        const result = await Todo.deleteMany({ completed: true });

        res.json({ 
            msg: "Completed todos removed", 
            deletedCount: result.deletedCount 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
});

// New route to remove a specific todo
app.delete("/todo/:id", async function (req, res) {
    try {
        const todoId = req.params.id;

        // Validate the ID format if needed
        if (!todoId) {
            return res.status(400).json({ message: "Todo ID is required" });
        }

        const result = await Todo.findByIdAndDelete(todoId);

        if (!result) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ 
            msg: "Todo deleted successfully", 
            deletedTodo: result 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
});
const PORT=process.env.PORT||8000;

app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}...`);
});
