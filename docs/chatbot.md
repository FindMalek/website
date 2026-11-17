# Portfolio chatbot

## Select a provider and model

Set this **server-only** environment variable locally and in the deployment:

```dotenv
AI_MODEL="anthropic:claude-haiku-5-5"
ANTHROPIC_API_KEY="your-key"
```

The format is `provider:model_name`. Changing it requires a server restart or
redeployment. Visitors cannot override it through the chat request.

| Provider  | Example `AI_MODEL`           | Required key        |
| --------- | ---------------------------- | ------------------- |
| Anthropic | `anthropic:claude-haiku-5-5` | `ANTHROPIC_API_KEY` |
| Groq      | `groq:openai/gpt-oss-120b`   | `GROQ_API_KEY`      |
| OpenAI    | `openai:gpt-4.1-mini`        | `OPENAI_API_KEY`    |

Only the selected provider needs a key. Leave unused keys unset, not empty.
When `AI_MODEL` is absent, it defaults to `anthropic:claude-haiku-5-5`.
Unknown providers, malformed values, and missing selected-provider keys are
configuration errors. Missing keys make chat return a friendly 503 response;
there is no automatic fallback that might spend credits on another provider.

Model IDs are passed through to the provider. Check that the selected model is
available to the account and supports streaming and tools. For example, the
`openai/` part of Groq's GPT-OSS model ID is a model namespace, not a switch to
the OpenAI API. **Groq does not serve Claude Haiku**; use Anthropic for Haiku.

`config/ai.ts` defines validation and the provider-to-key map.
`lib/ai-model.ts` registers providers with the Vercel AI SDK's
`createProviderRegistry`. To add another provider:

1. Install its compatible `@ai-sdk/*` package.
2. Add its identifier and key name to `AI_PROVIDER_KEYS` in `config/ai.ts`.
3. Register the provider in `lib/ai-model.ts`.
4. Add its optional key to `env.ts` and `.env.example`.
5. Document an example here and verify tool calling with that model.

Provider-specific settings stay conditional. Anthropic receives a five-minute
cache breakpoint on the shared system prompt. Haiku 5.5 uses medium effort
with thinking disabled; those settings are not applied blindly to other models.

## Context and retrieval

The shared prompt contains a compact biography, contact details, career timeline,
project/work summaries, and published blog titles and tags. It does **not**
contain every case study, blog body, playlist, or past search result.

The current page supplies its known title and subject, not an arbitrary page body.
For deeper questions, `searchPortfolio` selects one to three relevant topics:
projects, work, blog, about, books, music, resume, stack, or contributions.

Search ranks passages by title, keyword, and body matches, then returns at most
four excerpts of up to 1,600 characters each, with source titles and URLs.
It removes MDX author comments and excludes draft projects and posts, including
in development. Spotify is fetched only for music questions. Resume details use
the existing cached live resume with its checked-in fallback.

Search is local keyword retrieval, not embeddings or paid web search. The model
is instructed to use specific names and English index keywords even when answering
in French or Arabic, retrieve evidence before explaining technical details, and
acknowledge missing information rather than invent it. Broad comparisons may
need a separate search for each project.

Previous search excerpts are omitted from subsequent requests; the conversation
keeps the answers, and the model can retrieve evidence again if needed. This
shrinks request size. Source URLs stay internal for grounding; the interface does
not display source lists, counts, or citation panels.

## Reply style and activity

Substantive answers normally target 60–110 words, with up to 160 when a detailed
answer is requested. Greetings and simple facts stay shorter. The tone is warm,
specific, and conversational, with an optional relevant follow-up rather than a
sales pitch at the end of every message.

The interface renders text and tool parts in their actual stream order. It shows
preparation/writing status, named lookup activity, a simple completion label, and
tool failures. It does not fabricate research stages or expose hidden reasoning.
Text streams word by word with a small delay; activity fades respect reduced
motion and use polite screen-reader announcements.

## Cost controls and remaining limits

- At most three model steps per response: up to two tool rounds, then an answer
  with tool calling disabled on the final step.
- At most 600 output tokens per step, including tool arguments and any reasoning.
- No automatic model-request retries.
- Twelve recent messages; old retrieval payloads are reduced before transmission.
- Text-only visitor input, up to 2,000 characters per message and a 48 KB request.
- Request cancellation propagates to the model. The route has a 30-second
  deployment execution limit.
- `chat.usage` logs the selected model, input/output tokens, and cache reads/writes,
  not conversation text. These logs are **not** a persistent billing ledger.

The $10/year target is a traffic-dependent goal, **not an enforced annual cap**.
Detailed retrieval answers cost more than a simple one-step answer, and models
have different prices. Cache writes also cost money, and sparse traffic may not
get cache hits. Changing the model can significantly change the budget.

Before exposing the endpoint publicly, configure provider/workspace spending
limits and deployment-level rate limiting or bot protection. A strict annual
cap requires a durable usage ledger with atomic reservations across server
instances; an in-memory counter is not sufficient. None of those external
controls are configured by these code changes. Check the grant's expiry date too.

## Verification

The local request/retrieval/activity tests run without paid model calls:

```sh
pnpm exec esbuild evals/chatbot-request.test.ts evals/chatbot-behavior.test.ts --bundle --platform=node --outdir=.next/chat-tests
node --test .next/chat-tests/*.js
```

After configuring a real key, start the site and run `pnpm eval:chat` to check
factual answers and contact tools. This uses the selected provider and spends
API credits. Also manually check multi-turn follow-ups, activity indicators,
tool errors, cancellation, French/Arabic responses, and mobile/reduced-motion UI.
