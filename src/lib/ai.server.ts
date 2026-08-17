export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type Provider = {
  label: string;
  url: string;
  models: string[];
  headers: Record<string, string>;
};

/**
 * Provider chain: OpenCode Zen free models first, then NVIDIA native models,
 * then the built-in Lovable AI gateway so the assistant always answers.
 */
function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  const zenKey = process.env["OPENCODE_ZEN_API_KEY"];
  if (zenKey) {
    providers.push({
      label: "opencode-zen",
      url: "https://opencode.ai/zen/v1/chat/completions",
      headers: { Authorization: `Bearer ${zenKey}` },
      models: [
        "opencode/deepseek-v4-flash-free",
        "opencode/minimax-m3-free",
        "opencode/qwen-3.6-plus-free",
        "opencode/nemotron-3-ultra-free",
      ],
    });
  }

  const nvidiaKey = process.env["NVIDIA_API_KEY"];
  if (nvidiaKey) {
    providers.push({
      label: "nvidia",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      headers: { Authorization: `Bearer ${nvidiaKey}` },
      models: [
        "nvidia/llama-3.3-nemotron-super-49b-v1",
        "deepseek-ai/deepseek-v3.2",
        "openai/gpt-oss-120b",
      ],
    });
  }

  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (lovableKey) {
    providers.push({
      label: "lovable-ai",
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      headers: { "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "fetch" },
      models: ["google/gemini-3.6-flash"],
    });
  }

  return providers;
}

export async function chatComplete(messages: ChatMessage[]): Promise<string> {
  const providers = buildProviders();
  if (providers.length === 0) {
    throw new Error("No AI provider is configured.");
  }

  const failures: string[] = [];

  for (const provider of providers) {
    for (const model of provider.models) {
      try {
        const res = await fetch(provider.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...provider.headers },
          body: JSON.stringify({ model, messages, max_completion_tokens: 900 }),
        });

        if (!res.ok) {
          const body = await res.text();
          failures.push(`${provider.label}/${model} [${res.status}] ${body.slice(0, 200)}`);
          continue;
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
        failures.push(`${provider.label}/${model} returned an empty message`);
      } catch (error) {
        failures.push(`${provider.label}/${model} ${(error as Error).message}`);
      }
    }
  }

  console.error("All AI providers failed:", failures.join(" | "));
  throw new Error("The assistant is temporarily unavailable. Please try again.");
}
