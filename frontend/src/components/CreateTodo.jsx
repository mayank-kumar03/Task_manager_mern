import { useState } from "react";

export function CreateTodo({ onTodoAdded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddTodo = async () => {
        // Validate input
        if (!title.trim() || !description.trim()) {
            alert("Please enter both title and description");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/todo", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Show success message
            alert(data.msg);
            
            // Reset input fields
            setTitle("");
            setDescription("");

            // Trigger parent component to refresh todos
            if (onTodoAdded) {
                onTodoAdded();
            }
        } catch (error) {
            console.error("Error adding todo:", error);
            alert("Failed to add todo");
        }
    };

    return (
        <div>
           <div className="input-section">
                <input 
                    style={{
                        padding: 10,
                        margin: 10,
                        width: '300px'
                    }} 
                    type="text" 
                    placeholder="Enter todo title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <input  
                    style={{
                        padding: 10,
                        margin: 10,
                        width: '300px'
                    }}
                    type="text" 
                    placeholder="Enter todo description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <button 
                    style={{
                        padding: 10,
                        margin: 10,
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }} 
                    onClick={handleAddTodo}
                >
                    Add Todo
                </button>
            </div>
        </div>
    );
}