import { useCallback, useEffect, useState } from "react";
import { Client, generateClient } from "aws-amplify/data";
import { V6Client } from '@aws-amplify/api-graphql';
import { type Schema } from "../amplify/data/resource";
import { type ClientSchema, a } from "@aws-amplify/backend"

// const fooclient = generateClient<Schema>();
// fooclient.models.Todo.create;

export function createAIHooks() {
    const client = generateClient<Schema>();
    const routes: Extract<keyof Schema, string>[] = Object.keys(client.models) as Extract<keyof Schema, string>[];

    const hooks: { [x: string]: () => { sendMessage: () => void } } = {};
    routes.forEach(route => {
        hooks[`use${route}Chat`] = createUseChatHook(client.models[route].create); // imagine this is client.ai[route].sendMessage
    })
    return hooks;
}

export function createAIHooksActionStyle<T extends Schema>(client: V6Client<{ models: any }>) {
    const useActionHook = (routeName: keyof T) => {
        return createUseChatHook(client.models[routeName].create)();
    }
    return { useActionHook };
}

// export const createAllClients = (client: V6Client<T>) => {
//   const routes = Object.keys(client.models);

//   client.models.Todo.create

//   const hooks: { [x: string]: () => { sendMessage: () => void } } = {};
//   routes.forEach(route => {
//     hooks[`use${route}Chat`] = createUseChatHook(client.models.Todo.create);
//   })

//   const randomHook = hooks.useTodoChat();
//   randomHook.sendMessage();
//   return hooks;
// };

const createUseChatHook = (sendMessage) => () => {
    const [result, setResult] = useState('foobar');

    const foobar = useCallback(async () => {
        await sendMessage()
        setResult('wahtever');
    })


    return { sendMessage: foobar }
}


// export const createUseConversationHook = (chatSession: any) => (onMessage: (message: any) => void) => {
//   const [messages, setMessages] = useState([]);

//   const sendMessage = useCallback(async (message) => {
//     await chatSession.sendMessage({ message, context, responseComponents })
//   }, [])

//   useEffect(() => {
//     function handleMessage(message) {
//       onMessage(message)
//       setMessages([...messages, message])
//     }

//     chatSession.onMessage(handleMessage);
//     return () => { };
//   });


//   return { sendMessage, messages }
// }

// export const createUseGenerateHook = (generateFunction: any) => (onError: (error: any) => void) => {
//   const [result, setResult] = useState();

//   const generateRecipe = useCallback(async (prompt) => {
//     try {
//       const response = await generateFunction(prompt);
//       setResult(response);
//     } catch (error) {
//       onError(error);
//     }
//   }, [])


//   return { generateRecipe, result }
// }

// export const ListingCard: React.FC<CardProps> = (props) => {
//   const { title, body } = props;
//   return (
//     <div>
//       <p>This is a cool {title}</p>
//       {body}
//     </div>
//   );
// }

// interface CardProps {
//   title: string;
//   body: string | JSX.Element;
// }

// type ResponseComponentProp = {
//   type: string;
//   enum?: string[];
//   description?: string;
// }

// type ResponseComponentPropMap = {
//   [key: string]: ResponseComponentProp
// }

// type ResponseComponent = {
//   component: React.ComponentType<any>;
//   description?: string;
//   props: ResponseComponentPropMap;
// };

// interface ResponseComponents {
//   [key: string]: ResponseComponent
// }

// export const components: ResponseComponents = {
//   // component name
//   ListingCard: {
//     // actual React component
//     component: ListingCard,
//     description: '',
//     props: {
//       title: {
//         type: 'string'
//       },
//       body: {
//         type: 'string'
//       }
//     },
//   }
// }