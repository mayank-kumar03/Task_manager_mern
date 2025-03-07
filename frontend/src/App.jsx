import { useEffect, useState } from 'react'
import { CreateTodo } from './components/CreateTodo'

import { UpdateTodo } from './components/UpdateTodo'
import { DeleteTodo } from './components/DeleteTodo'
import './App.css';

function App() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch todos
  const fetchTodos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://task-manager-mern-1xrb.onrender.com/todos")
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const json = await response.json()
      
      // Validate the response structure
      if (!json.todos || !Array.isArray(json.todos)) {
        throw new Error("Invalid response format")
      }
      
      setTodos(json.todos)
    } catch (error) {
      console.error("Failed to fetch todos", error)
      setError(error.message)
      setTodos([]) // Clear todos on error
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Button to manually refresh todos
  const handleManualRefresh = () => {
    fetchTodos()
  }

  return (
    <div className="app-container">
      <header>
        <h1>Todo Management App</h1>
        <button 
          onClick={handleManualRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Todos'}
        </button>
      </header>

      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={handleManualRefresh} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          Loading todos...
        </div>
      )}

      <div className="todo-management">
        <CreateTodo onTodoAdded={fetchTodos} isLoading={isLoading} />
        {!isLoading && (
          <>
            
            <UpdateTodo todos={todos} onTodoUpdated={fetchTodos} />
            <DeleteTodo todos={todos} onTodosUpdated={fetchTodos} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;