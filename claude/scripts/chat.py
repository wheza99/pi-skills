#!/usr/bin/env python3
"""
Claude Chat Script

Usage: python chat.py "Your prompt" --model="claude-sonnet-4-6" [options]
"""

import argparse
import os
import sys
from anthropic import Anthropic


def parse_args():
    parser = argparse.ArgumentParser(description="Chat with Claude")
    parser.add_argument("prompt", help="The prompt to send to Claude")
    parser.add_argument("--model", default="claude-sonnet-4-6", help="Model to use")
    parser.add_argument("--system", help="System prompt")
    parser.add_argument("--max-tokens", type=int, default=1024, help="Max output tokens")
    parser.add_argument("--stream", action="store_true", help="Enable streaming")
    parser.add_argument("--thinking", action="store_true", help="Enable extended thinking")
    parser.add_argument("--budget", type=int, default=10000, help="Thinking budget tokens")
    parser.add_argument("--adaptive", action="store_true", help="Use adaptive thinking")
    parser.add_argument("--effort", choices=["low", "medium", "high", "max"], 
                        help="Effort level for adaptive thinking")
    return parser.parse_args()


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is required")
        print("Get your API key at https://console.claude.com/")
        sys.exit(1)

    args = parse_args()
    
    client = Anthropic()
    
    # Build request params
    params = {
        "model": args.model,
        "max_tokens": args.max_tokens,
        "messages": [{"role": "user", "content": args.prompt}]
    }
    
    if args.system:
        params["system"] = args.system
    
    # Thinking configuration
    if args.adaptive:
        params["thinking"] = {"type": "adaptive"}
        if args.effort:
            params["output_config"] = {"effort": args.effort}
    elif args.thinking:
        params["thinking"] = {"type": "enabled", "budget_tokens": args.budget}
    
    try:
        if args.stream:
            print("\n[Streaming response]\n")
            
            with client.messages.stream(**params) as stream:
                for event in stream:
                    if event.type == "content_block_delta":
                        if hasattr(event.delta, 'thinking') and event.delta.thinking:
                            print(event.delta.thinking, end="", flush=True)
                        elif hasattr(event.delta, 'text') and event.delta.text:
                            print(event.delta.text, end="", flush=True)
                    elif event.type == "content_block_start":
                        if hasattr(event.content_block, 'type'):
                            if event.content_block.type == "thinking":
                                print("\n[Thinking...]\n", flush=True)
                            elif event.content_block.type == "text":
                                print("\n[Response]\n", flush=True)
            
            print()
            
        else:
            response = client.messages.create(**params)
            
            # Handle thinking blocks
            has_thinking = False
            for block in response.content:
                if block.type == "thinking":
                    has_thinking = True
                    print(f"\n[Thinking]")
                    print(block.thinking[:500] + "..." if len(block.thinking) > 500 else block.thinking)
                elif block.type == "text":
                    if has_thinking:
                        print(f"\n[Answer]")
                    print(block.text)
            
            # Usage info
            print(f"\n[Usage]")
            print(f"Input tokens: {response.usage.input_tokens}")
            print(f"Output tokens: {response.usage.output_tokens}")
            if hasattr(response.usage, 'cache_read_input_tokens') and response.usage.cache_read_input_tokens:
                print(f"Cache read: {response.usage.cache_read_input_tokens}")
            if hasattr(response.usage, 'cache_creation_input_tokens') and response.usage.cache_creation_input_tokens:
                print(f"Cache created: {response.usage.cache_creation_input_tokens}")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
