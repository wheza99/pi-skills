#!/usr/bin/env python3
"""
Gemini Image Generation Script (Nano Banana)

Usage: python image-gen.py "A cute cat in space" [options]
"""

import argparse
import os
import sys
from google import genai
from google.genai import types


def parse_args():
    parser = argparse.ArgumentParser(description="Generate images with Gemini")
    parser.add_argument("prompt", help="The prompt for image generation")
    parser.add_argument("--model", default="gemini-2.5-flash-image", 
                        choices=["gemini-2.5-flash-image", "gemini-3-pro-image-preview"],
                        help="Model to use")
    parser.add_argument("--output", default="generated.png", help="Output file path")
    parser.add_argument("--aspect", default="1:1", 
                        choices=["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"],
                        help="Aspect ratio")
    parser.add_argument("--size", default="1K", choices=["1K", "2K", "4K"],
                        help="Image size (only for gemini-3-pro-image-preview)")
    parser.add_argument("--input-image", help="Input image for editing")
    parser.add_argument("--google-search", action="store_true", 
                        help="Enable Google Search grounding")
    return parser.parse_args()


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is required")
        print("Get your API key at https://aistudio.google.com/apikey")
        sys.exit(1)

    args = parse_args()
    
    client = genai.Client()
    
    # Build contents
    contents = [args.prompt]
    
    if args.input_image:
        try:
            from PIL import Image
            image = Image.open(args.input_image)
            contents.insert(0, image)
            print(f"Editing image: {args.input_image}")
        except ImportError:
            print("Error: PIL is required for image editing. Install with: pip install Pillow")
            sys.exit(1)
    
    # Build config
    config_params = {
        "response_modalities": ["TEXT", "IMAGE"]
    }
    
    # Image config
    image_config = types.ImageConfig(
        aspect_ratio=args.aspect
    )
    
    if args.model == "gemini-3-pro-image-preview":
        image_config.image_size = args.size
    
    config_params["image_config"] = image_config
    
    # Tools
    if args.google_search and args.model == "gemini-3-pro-image-preview":
        config_params["tools"] = [{"google_search": {}}]
        print("Google Search grounding enabled")
    
    config = types.GenerateContentConfig(**config_params)
    
    print(f"\nModel: {args.model}")
    print(f"Aspect ratio: {args.aspect}")
    if args.model == "gemini-3-pro-image-preview":
        print(f"Size: {args.size}")
    print(f"\nGenerating image...")
    
    try:
        response = client.models.generate_content(
            model=args.model,
            contents=contents,
            config=config
        )
        
        saved_images = 0
        for i, part in enumerate(response.parts):
            if part.text is not None:
                print(f"\n[Text]: {part.text}")
            elif part.inline_data is not None:
                image = part.as_image()
                if saved_images == 0:
                    output_path = args.output
                else:
                    base, ext = os.path.splitext(args.output)
                    output_path = f"{base}_{saved_images}{ext}"
                image.save(output_path)
                print(f"\n[Image saved]: {output_path}")
                saved_images += 1
        
        if saved_images == 0:
            print("No images were generated")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
