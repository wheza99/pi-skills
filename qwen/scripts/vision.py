#!/usr/bin/env python3
"""
Qwen Vision Script
Usage: python vision.py "Describe this image" --image path/to/image.jpg
"""

import argparse
import base64
import os
import sys
from openAI import OpenAI


def encode_image(image_path):
    """Encode image to base64"""
    with open(image_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def main():
    parser = argparse.ArgumentParser(description='Analyze images with Qwen-VL')
    parser.add_argument('prompt', help='Your question about the image')
    parser.add_argument('--image', required=True, help='Path to image file')
    parser.add_argument('--model', default='qwen2.5-vl-7b-instruct', help='Model name')
    parser.add_argument('--url', help='Image URL instead of file')

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

    # Prepare image content
    if args.url:
        image_url = args.url
    else:
        if not os.path.exists(args.image):
            print(f'Error: Image file not found: {args.image}')
            sys.exit(1)

        # Detect image type
        ext = os.path.splitext(args.image)[1].lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }
        mime_type = mime_types.get(ext, 'image/jpeg')

        base64_image = encode_image(args.image)
        image_url = f'data:{mime_type};base64,{base64_image}'

    messages = [
        {
            'role': 'user',
            'content': [
                {'type': 'image_url', 'image_url': {'url': image_url}},
                {'type': 'text', 'text': args.prompt}
            ]
        }
    ]

    try:
        response = client.chat.completions.create(
            model=args.model,
            messages=messages
        )

        print(response.choices[0].message.content)

    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
