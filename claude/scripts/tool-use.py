#!/usr/bin/env python3
"""
Claude Tool Use Demo

Usage: python tool-use.py "What's the weather in Tokyo?"
"""

import argparse
import os
import sys
import json
from anthropic import Anthropic


# Example tool implementations
def get_weather(location: str) -> dict:
    """Get the current weather for a location (mock)."""
    weather_data = {
        "tokyo": {"temperature": 22, "condition": "Sunny", "humidity": 65},
        "london": {"temperature": 15, "condition": "Cloudy", "humidity": 80},
        "new york": {"temperature": 18, "condition": "Partly Cloudy", "humidity": 70},
        "san francisco": {"temperature": 16, "condition": "Foggy", "humidity": 85},
    }
    
    for city, data in weather_data.items():
        if city in location.lower():
            return {"location": city.title(), **data}
    
    return {"location": location, "temperature": 20, "condition": "Unknown", "humidity": 60}


def calculate(operation: str, a: float, b: float) -> dict:
    """Perform a calculation."""
    ops = {
        "add": a + b,
        "subtract": a - b,
        "multiply": a * b,
        "divide": a / b if b != 0 else "Error: Division by zero"
    }
    result = ops.get(operation, "Unknown operation")
    return {"operation": operation, "a": a, "b": b, "result": result}


# Tool definitions
TOOLS = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state/country, e.g., 'Tokyo, Japan' or 'San Francisco, CA'"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "calculate",
        "description": "Perform a mathematical calculation",
        "input_schema": {
            "type": "object",
            "properties": {
                "operation": {
                    "type": "string",
                    "enum": ["add", "subtract", "multiply", "divide"],
                    "description": "The operation to perform"
                },
                "a": {"type": "number", "description": "First number"},
                "b": {"type": "number", "description": "Second number"}
            },
            "required": ["operation", "a", "b"]
        }
    }
]

TOOL_FUNCTIONS = {
    "get_weather": get_weather,
    "calculate": calculate
}


def parse_args():
    parser = argparse.ArgumentParser(description="Tool use demo with Claude")
    parser.add_argument("prompt", help="The prompt to send to Claude")
    parser.add_argument("--model", default="claude-sonnet-4-6", help="Model to use")
    parser.add_argument("--max-tokens", type=int, default=1024, help="Max output tokens")
    return parser.parse_args()


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is required")
        print("Get your API key at https://console.claude.com/")
        sys.exit(1)

    args = parse_args()
    
    client = Anthropic()
    
    messages = [{"role": "user", "content": args.prompt}]
    
    print(f"\n[Prompt] {args.prompt}")
    print(f"[Model] {args.model}\n")
    
    try:
        # First request
        response = client.messages.create(
            model=args.model,
            max_tokens=args.max_tokens,
            tools=TOOLS,
            messages=messages
        )
        
        # Process response
        while True:
            # Check for tool use
            tool_uses = [block for block in response.content if block.type == "tool_use"]
            
            if tool_uses:
                # Build assistant message
                messages.append({"role": "assistant", "content": response.content})
                
                # Execute tools and build results
                tool_results = []
                for tool_use in tool_uses:
                    print(f"[Tool Call] {tool_use.name}")
                    print(f"[Input] {tool_use.input}")
                    
                    # Execute the tool
                    func = TOOL_FUNCTIONS.get(tool_use.name)
                    if func:
                        result = func(**tool_use.input)
                        print(f"[Result] {result}")
                        
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_use.id,
                            "content": json.dumps(result)
                        })
                
                # Send tool results back
                messages.append({"role": "user", "content": tool_results})
                
                # Get next response
                response = client.messages.create(
                    model=args.model,
                    max_tokens=args.max_tokens,
                    tools=TOOLS,
                    messages=messages
                )
            else:
                # No more tool calls, print final response
                for block in response.content:
                    if block.type == "text":
                        print(f"\n[Response]")
                        print(block.text)
                break
        
        print(f"\n[Usage]")
        print(f"Input tokens: {response.usage.input_tokens}")
        print(f"Output tokens: {response.usage.output_tokens}")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
