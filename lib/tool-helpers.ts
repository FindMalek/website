/**
 * Minimal shape shared by every tool-UI component's `toolCall` prop.
 * AI SDK v5's UIToolInvocation carries `input`/`output` (not `args`/`result`)
 * and derives the tool name from the message part's `type` discriminant
 * rather than a `toolName` field, so callers that need the name pass it
 * separately.
 */
export interface ToolCallLike {
  toolCallId: string
  input?: Record<string, unknown>
  output?: Record<string, unknown>
}

/**
 * Extracts arguments from a tool call
 * @param toolCall The tool call object
 * @returns Extracted arguments from the tool call
 */
export function getToolArgs<T extends Record<string, unknown>>(
  toolCall: ToolCallLike
): T {
  return (toolCall.input ?? {}) as T
}

/**
 * Creates a result object for a tool call
 * @param success Whether the tool operation was successful
 * @param data Additional data to include in the result
 * @returns A formatted result object
 */
export function createToolResult(
  success: boolean,
  data: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    success,
    ...data,
  }
}

/**
 * Safely converts a result to JSON string
 * @param result The result object to stringify
 * @returns JSON string representation of the result
 */
export function stringifyToolResult(result: Record<string, unknown>): string {
  try {
    return JSON.stringify(result)
  } catch (error) {
    console.error("Error stringifying tool result:", error)
    return JSON.stringify({ success: false, error: "Failed to process result" })
  }
}

/**
 * Validates that a tool call has a valid ID
 * @param toolCall The tool call to validate
 * @returns True if the tool call has a valid ID
 */
export function isValidToolCall(toolCall: ToolCallLike | undefined): boolean {
  return Boolean(toolCall && toolCall.toolCallId)
}
