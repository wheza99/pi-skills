#!/usr/bin/env python3
"""
Qwen Chat Script
Usage: python chat.py "Your prompt" --model qwen-max-latest
"""

import argparse
import os
import sys
from openai import OpenAI


def main():
    parser = argparse.ArgumentParser(description='Chat with Qwen models')
    parser.add_argument('prompt', help='Your prompt')
    parser.add_argument('--model', default='qwen-max-latest', help='Model name')
    parser.add_argument('--temp', type=float, default=0.7, help='Temperature')
    parser.add_argument('--no-stream', action='store_true', help='Disable streaming')
    parser.add_argument('--system', default='You are a helpful assistant.', help='System message')

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

    messages = [
        {'role': 'system', 'content': args.system},
        {'role': 'user', 'content': args.prompt}
    ]

    try:
        if args.no_stream:
            response = client.chat.completions.create(
                model=args.model,
                messages=messages,
                temperature=args.temp
            )
            print(response.choices[0].message.content)
        else:
            stream = client.chat.completions.create(
                model=args.model,
                messages=messages,
                temperature=args.temp,
                stream=True
            )

            for chunk in stream:
                content = chunk.choices[0].delta.content or ''
                print(content, end='', flush=True)
            print()

    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
