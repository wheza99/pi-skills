#!/usr/bin/env python3
"""
Claude Vision Script

Usage: python vision.py image.jpg "Describe this image" [options]
"""

import argparse
import os
import sys
import base64
from anthropic import Anthropic


def parse_args():
    parser = argparse.ArgumentParser(description="Analyze images with Claude")
    parser.add_argument("image", help="Path to image file")
    parser.add_argument("prompt", nargs="?", default="Describe this image in detail", 
                        help="What to ask about the image")
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
    
    if not os.path.exists(args.image):
        print(f"Error: Image file not found: {args.image}")
        sys.exit(1)
    
    # Read and encode image
    with open(args.image, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")
    
    # Detect media type
    ext = os.path.splitext(args.image)[1].lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp"
    }
    media_type = media_types.get(ext, "image/jpeg")
    
    client = Anthropic()
    
    try:
        response = client.messages.create(
            model=args.model,
            max_tokens=args.max_tokens,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": args.prompt
                        }
                    ]
                }
            ]
        )
        
        print(f"\n[Model] {args.model}")
        print(f"[Image] {args.image}")
        print(f"[Prompt] {args.prompt}")
        print(f"\n[Response]")
        print(response.content[0].text)
        
        print(f"\n[Usage]")
        print(f"Input tokens: {response.usage.input_tokens}")
        print(f"Output tokens: {response.usage.output_tokens}")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
