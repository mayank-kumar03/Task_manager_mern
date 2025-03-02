import { useState } from "react";

export function UpdateTodo({ todos, onTodoUpdated }) {
    const handleCompleteTodo = async (todoId) => {
        try {
            const response = await fetch("http://localhost:8000/completed", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    id: todoId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Show success message
            alert(data.msg);
            
            // Trigger parent component to refresh todos
            if (onTodoUpdated) {
                onTodoUpdated();
            }
        } catch (error) {
            console.error("Error completing todo:", error);
            alert("Failed to complete todo");
        }
    };

    return (
        <div className="todos-container">
            <h2>Todo List</h2>
            {Array.isArray(todos) && todos.length > 0 ? (
                <div className="todos-grid">
                    {todos.map((todo) => (
                        <div 
                            key={todo._id}
                            className="todo-card"
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                margin: '10px',
                                backgroundColor: todo.completed ? '#e8f5e9' : '#f9f9f9',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <h3 style={{ 
                                    margin: '0 0 10px 0',
                                    color: todo.completed ? '#4CAF50' : '#333'
                                }}>
                                    {todo.title}
                                </h3>
                                <p style={{ 
                                    margin: '0 0 10px 0',
                                    color: todo.completed ? '#777' : '#000'
                                }}>
                                    {todo.description}
                                </p>
                            </div>
                            
                            <div className="todo-status">
                                <span 
                                    style={{
                                        color: todo.completed ? 'green' : 'orange',
                                        fontWeight: 'bold',
                                        display: 'block',
                                        marginTop: '10px'
                                    }}
                                >
                                    Status: {todo.completed ? "Completed" : "Pending"}
                                </span>
                                
                                {!todo.completed && (
                                    <button
                                        onClick={() => handleCompleteTodo(todo._id)}
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginTop: '10px',
                                            width: '100%'
                                        }}
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    style={{
                        textAlign: 'center',
                        color: '#888',
                        padding: '20px',
                        border: '1px dashed #ddd',
                        borderRadius: '8px'
                    }}
                >
                    <p>No todos found. Start by adding a new todo!</p>
                </div>
            )}
        </div>
    );
}