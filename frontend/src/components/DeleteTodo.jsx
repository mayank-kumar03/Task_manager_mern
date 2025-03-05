import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function DeleteTodo({ todos, onTodosUpdated }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTodos, setSelectedTodos] = useState([]);

    // Function to remove all completed todos
    const handleRemoveCompletedTodos = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/completed-todos", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to remove completed todos");
            }

            const data = await response.json();

            // Notify parent component about the update
            onTodosUpdated();

            // Show success notification
            alert(`${data.deletedCount} completed todos removed`);
        } catch (error) {
            console.error("Error removing completed todos:", error);
            setError(error.message);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete a specific todo
    const handleDeleteTodo = async (todoId) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/todo/${todoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete todo");
            }

            // Notify parent component about the update
            onTodosUpdated();

            // Show success notification
            alert("Todo deleted successfully");
        } catch (error) {
            console.error("Error deleting todo:", error);
            setError(error.message);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle bulk delete of selected todos
    const handleBulkDelete = async () => {
        if (selectedTodos.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/todos", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ids: selectedTodos })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete selected todos");
            }

            const data = await response.json();

            // Clear selected todos
            setSelectedTodos([]);

            // Notify parent component about the update
            onTodosUpdated();

            // Show success notification
            alert(`${data.deletedCount} todos deleted`);
        } catch (error) {
            console.error("Error deleting todos:", error);
            setError(error.message);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle todo selection
    const toggleTodoSelection = (todoId) => {
        setSelectedTodos(prev => 
            prev.includes(todoId)
                ? prev.filter(id => id !== todoId)
                : [...prev, todoId]
        );
    };

    return (
        <div className="delete-todo-container" style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <div className="delete-actions" style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <button 
                    onClick={handleRemoveCompletedTodos}
                    disabled={isLoading}
                    style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.5 : 1
                    }}
                >
                    {isLoading ? 'Removing...' : 'Remove Completed Todos'}
                </button>

                <button 
                    onClick={handleBulkDelete}
                    disabled={isLoading || selectedTodos.length === 0}
                    style={{
                        backgroundColor: selectedTodos.length > 0 ? '#ff4d4d' : '#cccccc',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: isLoading || selectedTodos.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Delete Selected Todos
                </button>
            </div>

            {error && (
                <div 
                    style={{
                        backgroundColor: '#ffdddd',
                        color: '#ff0000',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '15px'
                    }}
                >
                    {error}
                </div>
            )}

            <div className="todos-list">
                <h3>Todo List</h3>
                {todos.length === 0 ? (
                    <p>No todos available</p>
                ) : (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0
                    }}>
                        {todos.map((todo) => (
                            <li 
                                key={todo._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: todo.completed ? '#e6f3e6' : '#fff',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                    border: `1px solid ${todo.completed ? '#4CAF50' : '#ddd'}`
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="checkbox"
                                        checked={selectedTodos.includes(todo._id)}
                                        onChange={() => toggleTodoSelection(todo._id)}
                                        disabled={todo.completed}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <div>
                                        <h4 style={{
                                            margin: 0,
                                            color: todo.completed ? '#4CAF50' : '#333',
                                            textDecoration: todo.completed ? 'line-through' : 'none'
                                        }}>
                                            {todo.title}
                                        </h4>
                                        <p style={{
                                            margin: '5px 0 0',
                                            color: todo.completed ? '#888' : '#666'
                                        }}>
                                            {todo.description}
                                        </p>
                                    </div>
                                </div>
                                {!todo.completed && (
                                    <button 
                                        onClick={() => handleDeleteTodo(todo._id)}
                                        disabled={isLoading}
                                        style={{
                                            backgroundColor: '#ff4d4d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: isLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// PropTypes for type checking
DeleteTodo.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            completed: PropTypes.bool
        })
    ).isRequired,
    onTodosUpdated: PropTypes.func.isRequired
};
