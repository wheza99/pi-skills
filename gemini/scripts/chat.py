#!/usr/bin/env python3
"""
Gemini Chat Script

Usage: python chat.py "Your prompt" --model="gemini-3-flash-preview" [options]
"""

import argparse
import os
import sys
from google import genai
from google.genai import types


def parse_args():
    parser = argparse.ArgumentParser(description="Chat with Gemini")
    parser.add_argument("prompt", help="The prompt to send to Gemini")
    parser.add_argument("--model", default="gemini-3-flash-preview", help="Model to use")
    parser.add_argument("--stream", action="store_true", help="Enable streaming")
    parser.add_argument("--system", help="System instruction")
    parser.add_argument("--temperature", type=float, help="Temperature (0-2)")
    parser.add_argument("--max-tokens", type=int, help="Max output tokens")
    parser.add_argument("--thinking", action="store_true", help="Include thinking")
    parser.add_argument("--thinking-level", choices=["minimal", "low", "medium", "high"], 
                        help="Thinking level for Gemini 3")
    return parser.parse_args()


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is required")
        print("Get your API key at https://aistudio.google.com/apikey")
        sys.exit(1)

    args = parse_args()
    
    client = genai.Client()
    
    # Build config
    config_params = {}
    
    if args.system:
        config_params["system_instruction"] = args.system
    
    if args.temperature is not None:
        config_params["temperature"] = args.temperature
    
    if args.max_tokens:
        config_params["max_output_tokens"] = args.max_tokens
    
    if args.thinking or args.thinking_level:
        thinking_config = types.ThinkingConfig()
        if args.thinking:
            thinking_config.include_thoughts = True
        if args.thinking_level:
            thinking_config.thinking_level = args.thinking_level
        config_params["thinking_config"] = thinking_config
    
    config = types.GenerateContentConfig(**config_params) if config_params else None
    
    try:
        if args.stream:
            print("\n[Streaming response]\n")
            response = client.models.generate_content_stream(
                model=args.model,
                contents=args.prompt,
                config=config
            )
            for chunk in response:
                if chunk.text:
                    print(chunk.text, end="", flush=True)
            print()
        else:
            response = client.models.generate_content(
                model=args.model,
                contents=args.prompt,
                config=config
            )
            
            # Handle thinking
            if args.thinking or args.thinking_level:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'thought') and part.thought:
                        print("\n[Thinking]")
                        print(part.text)
                        print("\n[Answer]")
                    elif part.text:
                        print(part.text)
            else:
                print("\n[Response]")
                print(response.text)
            
            # Usage info
            if hasattr(response, 'usage_metadata'):
                print(f"\n[Usage]")
                print(f"Prompt tokens: {response.usage_metadata.prompt_token_count}")
                print(f"Completion tokens: {response.usage_metadata.candidates_token_count}")
                if hasattr(response.usage_metadata, 'thoughts_token_count'):
                    print(f"Thinking tokens: {response.usage_metadata.thoughts_token_count}")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
