#!/usr/bin/env python3
"""
Qwen Thinking Mode Script
Usage: python thinking.py "Your complex question" --model qwen3-8b
"""

import argparse
import os
import sys
from openai import OpenAI


def main():
    parser = argparse.ArgumentParser(description='Chat with Qwen thinking models')
    parser.add_argument('prompt', help='Your prompt')
    parser.add_argument('--model', default='qwen3-30b-a3b-thinking-2507', help='Model name')
    parser.add_argument('--show-thinking', action='store_true', help='Show thinking process')
    parser.add_argument('--temp', type=float, default=0.6, help='Temperature')

    args = parser.parse_args()

    # Check for API key
    api_key = os.environ.get('DASHSCOPE_API_KEY') or os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print('Error: Set DASHSCOPE_API_KEY or OPENAI_API_KEY environment variable')
        sys.exit(1)

    # Initialize client
    client = OpenAI(
        api_key=api_key,
        base_url=os.environ.get('OPENAI_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1')
    )

    messages = [{'role': 'user', 'content': args.prompt}]

    try:
        stream = client.chat.completions.create(
            model=args.model,
            messages=messages,
            temperature=args.temp,
            stream=True
        )

        thinking_content = ''
        answer_content = ''

        for chunk in stream:
            delta = chunk.choices[0].delta

            # Check for reasoning/thinking content
            if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
                thinking_content += delta.reasoning_content
                if args.show_thinking:
                    print(f'\033[90m{delta.reasoning_content}\033[0m', end='', flush=True)

            # Regular content
            if delta.content:
                answer_content += delta.content
                print(delta.content, end='', flush=True)

        print()

        if args.show_thinking and thinking_content:
            print('\n' + '='*50)
            print('\033[90m[THINKING PROCESS]\033[0m')
            print(f'\033[90m{thinking_content}\033[0m')

    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
