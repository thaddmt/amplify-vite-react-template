import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { createAIHooks, createAIHooksActionStyle } from "./AI";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { V6Client } from '@aws-amplify/api-graphql';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const foobar = createAIHooks(client);
console.log(foobar);

const { useActionHook } = createAIHooksActionStyle<Schema>(client);


function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { sendMessage } = useActionHook('Todo');
  console.log({ sendMessage })

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://next-release-dev.d1ywzrxfkb9wgg.amplifyapp.com/react/start/quickstart/vite-react-app/#step-2-add-delete-to-do-functionality">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
