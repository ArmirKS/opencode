import { describe, expect, test } from "bun:test"
import { Schema } from "effect"
import { SessionV1 } from "@opencode-ai/core/v1/session"
import { SessionPrompt } from "../../src/session/prompt"
import { Identifier } from "../../src/id/id"

const SESSION_ID = Identifier.descending("session")
const MESSAGE_ID = Identifier.ascending("message")

const decodePromptInput = Schema.decodeUnknownSync(SessionPrompt.PromptInput)
const decodeShellInput = Schema.decodeUnknownSync(SessionPrompt.ShellInput)
const decodeUser = Schema.decodeUnknownSync(SessionV1.User)

describe("parentAgent hook input", () => {
  test("PromptInput accepts parentAgent", () => {
    const input = decodePromptInput({
      sessionID: SESSION_ID,
      agent: "scout",
      parentAgent: "coder",
      parts: [{ type: "text", text: "test" }],
    })
    expect(input.parentAgent).toBe("coder")
  })

  test("PromptInput parentAgent is optional", () => {
    const input = decodePromptInput({
      sessionID: SESSION_ID,
      agent: "scout",
      parts: [{ type: "text", text: "test" }],
    })
    expect(input.parentAgent).toBeUndefined()
  })

  test("ShellInput accepts parentAgent", () => {
    const input = decodeShellInput({
      sessionID: SESSION_ID,
      agent: "coder",
      parentAgent: "orchestrator",
      command: "ls",
    })
    expect(input.parentAgent).toBe("orchestrator")
  })

  test("UserMessage stores parentAgent", () => {
    const msg = decodeUser({
      id: MESSAGE_ID,
      sessionID: SESSION_ID,
      role: "user",
      time: { created: Date.now() },
      agent: "scout",
      parentAgent: "coder",
      model: { providerID: "anthropic", modelID: "claude-sonnet-4-6" },
    })
    expect(msg.parentAgent).toBe("coder")
  })

  test("UserMessage parentAgent is optional", () => {
    const msg = decodeUser({
      id: MESSAGE_ID,
      sessionID: SESSION_ID,
      role: "user",
      time: { created: Date.now() },
      agent: "coder",
      model: { providerID: "openai", modelID: "gpt-5.4" },
    })
    expect(msg.parentAgent).toBeUndefined()
  })
})
