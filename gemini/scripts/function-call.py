#!/usr/bin/env python3
"""
Gemini Function Calling Demo

Usage: python function-call.py "What's the weather in Tokyo?"
"""

import argparse
import os
import sys
import json
from google import genai
from google.genai import types


# Example functions
def get_weather(location: str) -> dict:
    """Get the current weather for a location (mock)."""
    # In a real app, this would call a weather API
    weather_data = {
        "Tokyo": {"temperature": 22, "condition": "Sunny", "humidity": 65},
        "London": {"temperature": 15, "condition": "Cloudy", "humidity": 80},
        "New York": {"temperature": 18, "condition": "Partly Cloudy", "humidity": 70},
        "Sydney": {"temperature": 25, "condition": "Clear", "humidity": 55},
    }
    
    for city, data in weather_data.items():
        if city.lower() in location.lower():
            return {"location": city, **data}
    
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


# Function declarations
WEATHER_DECLARATION = {
    "name": "get_weather",
    "description": "Gets the current weather for a given location",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state/country, e.g., 'Tokyo, Japan' or 'New York, NY'"
            }
        },
        "required": ["location"]
    }
}

CALCULATE_DECLARATION = {
    "name": "calculate",
    "description": "Perform a mathematical calculation",
    "parameters": {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": ["add", "subtract", "multiply", "divide"],
                "description": "The mathematical operation to perform"
            },
            "a": {
                "type": "number",
                "description": "The first number"
            },
            "b": {
                "type": "number",
                "description": "The second number"
            }
        },
        "required": ["operation", "a", "b"]
    }
}

# Function mapping
FUNCTIONS = {
    "get_weather": get_weather,
    "calculate": calculate
}


def parse_args():
    parser = argparse.ArgumentParser(description="Function calling demo with Gemini")
    parser.add_argument("prompt", help="The prompt to send to Gemini")
    parser.add_argument("--model", default="gemini-3-flash-preview", help="Model to use")
    parser.add_argument("--auto", action="store_true", 
                        help="Enable automatic function calling")
    return parser.parse_args()


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is required")
        print("Get your API key at https://aistudio.google.com/apikey")
        sys.exit(1)

    args = parse_args()
    
    client = genai.Client()
    
    # Setup tools
    tools = types.Tool(function_declarations=[WEATHER_DECLARATION, CALCULATE_DECLARATION])
    
    if args.auto:
        # Automatic function calling (Python SDK feature)
        config = types.GenerateContentConfig(
            tools=[get_weather, calculate]  # Pass actual functions
        )
        
        print(f"\n[Prompt] {args.prompt}")
        print(f"[Model] {args.model}")
        print(f"[Mode] Automatic function calling\n")
        
        response = client.models.generate_content(
            model=args.model,
            contents=args.prompt,
            config=config
        )
        
        print(response.text)
        
    else:
        # Manual function calling
        config = types.GenerateContentConfig(tools=[tools])
        
        print(f"\n[Prompt] {args.prompt}")
        print(f"[Model] {args.model}")
        print(f"[Mode] Manual function calling\n")
        
        # Step 1: Send request
        contents = [types.Content(role="user", parts=[types.Part(text=args.prompt)])]
        
        response = client.models.generate_content(
            model=args.model,
            contents=contents,
            config=config
        )
        
        # Check for function call
        part = response.candidates[0].content.parts[0]
        
        if part.function_call:
            fc = part.function_call
            print(f"[Function Call] {fc.name}")
            print(f"[Arguments] {fc.args}")
            
            # Execute function
            func = FUNCTIONS.get(fc.name)
            if func:
                result = func(**fc.args)
                print(f"[Result] {result}")
                
                # Step 2: Send result back
                contents.append(response.candidates[0].content)
                contents.append(types.Content(
                    role="user",
                    parts=[types.Part.from_function_response(
                        name=fc.name,
                        response=result
                    )]
                ))
                
                final_response = client.models.generate_content(
                    model=args.model,
                    contents=contents,
                    config=config
                )
                
                print(f"\n[Final Response]")
                print(final_response.text)
            else:
                print(f"Unknown function: {fc.name}")
        else:
            print("[Response]")
            print(response.text)


if __name__ == "__main__":
    main()
