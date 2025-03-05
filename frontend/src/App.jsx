import { useEffect, useState } from 'react'
import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'
import { UpdateTodo } from './components/UpdateTodo'
import { DeleteTodo } from './components/DeleteTodo'

function App() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch todos
  const fetchTodos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8000/todos")
      
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
    <div className="app-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Todo Management App</h1>
        <button 
          onClick={handleManualRefresh}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Todos'}
        </button>
      </header>

      {/* Error Handling */}
      {error && (
        <div 
          style={{
            backgroundColor: '#ffdddd',
            color: '#ff0000',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px'
          }}
        >
          Error: {error}
          <button 
            onClick={handleManualRefresh}
            style={{
              marginLeft: '10px',
              backgroundColor: '#ff0000',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            fontSize: '18px',
            color: '#666'
          }}
        >
          Loading todos...
        </div>
      )}

      {/* Todo Management Components */}
      <div className="todo-management">
        <CreateTodo 
          onTodoAdded={fetchTodos} 
          isLoading={isLoading}
        />
        
        {!isLoading && (
          <>
            <Todos 
              todos={todos} 
              isLoading={isLoading}
            />
            <UpdateTodo 
              todos={todos}
              onTodoUpdated={fetchTodos} 
            />
          </>
        )}
         <DeleteTodo 
                todos={todos} 
                onTodosUpdated={fetchTodos}
            />
      </div>
    </div>
  )
}

export default App