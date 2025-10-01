import { generateText, tool } from "ai";
import { ollama } from "ollama-ai-provider-v2";
import z from "zod";

async function main() {
  const response = await generateText({
    model: ollama("qwen3:4b"),
    prompt:
      "You are an agent helping users find information about Pokemon. Always call the PokeAPI tool to get information about Pokemon and then return a short text summary. I want to know about Mewtwo. /no_thinking",
    tools: {
      pokeAPI: tool({
        description: "Call the PokeAPI to get information about Pokemon.",
        execute: async ({ pokemonName }) => {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
          );

          return res.json();
        },
        inputSchema: z.object({
          pokemonName: z.string().describe("The pokemon name to search."),
        }),
      }),
    },
  });

  console.dir(response.content, { depth: null });
}

main();
