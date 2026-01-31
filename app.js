import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
const groq = new Groq({
apiKey:process.env.GROQ_API_KEY
});
async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    
    messages: [
      {
        role: "system",
        content: `
You are an AI assistant named Aaru.

Rules:
- Use tools when required.
- When calling a tool, respond ONLY with JSON.
- Never wrap tool calls in XML or text.
`,
      },
      {
        role: "user",
        content: "When was iphone 16 launched?",
      },
    ],
    tools:[
      {
      type: "function",
      function: {
        name: "webSearch",
        description: "Search the latest information and realtime data on the internet.",
        parameters: {
          // JSON Schema object
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query to perfom search on.",
            },
          },
          required: ["query"]
        }
      }
    }
  ],
  tool_choice:'auto'
  });

  const tool_calls=completion.choices[0].message.tool_calls
  if(!tool_calls){
    console.log(`Assistant: ${completion.choices[0].message.content} `)
    return;
  }

  for(const tool of tool_calls){
    console.log('tool:',tool);
    const functionName=tool.function.name;
    const functionParams=tool.function.arguments;

    if(functionName==='webSearch'){
      const toolResult=await webSearch(JSON.parse(functionParams));
      console.log('Tool result:',toolResult);
    }
  }

 // console.log(JSON.stringify(completion.choices[0]?.message,null,2));
}
main().catch(console.error); 



 async function webSearch({query}){
  console.log('Calling web search...');  
  return 'Iphone was lauched on 20 september 2024.';
}



