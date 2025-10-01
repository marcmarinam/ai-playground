import { generateText, stepCountIs, tool } from "ai";
import { ollama } from "ollama-ai-provider-v2";
import z from "zod";

async function main() {
  const response = await generateText({
    model: ollama("hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_S"),
    prompt: "Tell me about Mewtwo. Write a short text summary. Max 200 words.",
    stopWhen: stepCountIs(10),
    tools: {
      pokeAPI: tool({
        description: "Call the PokeAPI to get information about Pokemon.",
        execute: async ({ pokemonName }) => {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
          );

          const response = await res.json();

          return response;
        },
        inputSchema: z.object({
          pokemonName: z.string().describe("The pokemon name to search."),
        }),
      }),
    },
  });

  console.dir(response.text, { depth: null });
}

main();
