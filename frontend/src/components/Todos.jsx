export function Todos({todos}){
      return <div>
      {todos.map(function(todo) {
           return <div>
             <h1>{todo.title}   </h1>
            <h1>{todo.description}</h1>
            <button>{todo.completed==true?"Completed":"Mark as Completed"}   </button>
           </div>
      })}
      </div>
}