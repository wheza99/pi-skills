#!/usr/bin/env python3
"""
Claude Structured Output Demo

Usage: python structured.py "Extract: John is 30, a software engineer" --schema="person"
"""

import argparse
import os
import sys
import json
from anthropic import Anthropic
from pydantic import BaseModel, Field
from typing import List, Optional


# Example schemas
class Person(BaseModel):
    name: str = Field(description="Full name of the person")
    age: int = Field(description="Age in years")
    occupation: str = Field(description="Job or profession")


class Recipe(BaseModel):
    recipe_name: str = Field(description="Name of the recipe")
    prep_time_minutes: Optional[int] = Field(description="Preparation time in minutes")
    ingredients: List[str] = Field(description="List of ingredients")
    instructions: List[str] = Field(description="Step-by-step instructions")


class Product(BaseModel):
    name: str = Field(description="Product name")
    price: float = Field(description="Price in USD")
    category: str = Field(description="Product category")
    in_stock: bool = Field(description="Whether in stock")


SCHEMAS = {
    "person": Person,
    "recipe": Recipe,
    "product": Product
}


def parse_args():
    parser = argparse.ArgumentParser(description="Structured output with Claude")
    parser.add_argument("prompt", help="The prompt to send to Claude")
    parser.add_argument("--model", default="claude-sonnet-4-6", help="Model to use")
    parser.add_argument("--max-tokens", type=int, default=1024, help="Max output tokens")
    parser.add_argument("--schema", choices=list(SCHEMAS.keys()), default="person",
                        help="Schema to use")
    parser.add_argument("--output", help="Output file for result (JSON)")
    return parser.parse_args()


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is required")
        print("Get your API key at https://console.claude.com/")
        sys.exit(1)

    args = parse_args()
    
    client = Anthropic()
    schema_class = SCHEMAS[args.schema]
    
    print(f"\n[Schema] {args.schema}")
    print(f"[Model] {args.model}")
    print(f"\n[Prompt] {args.prompt[:100]}..." if len(args.prompt) > 100 else f"\n[Prompt] {args.prompt}")
    
    try:
        # Use parse() for structured output
        response = client.messages.parse(
            model=args.model,
            max_tokens=args.max_tokens,
            messages=[{"role": "user", "content": args.prompt}],
            output_format=schema_class
        )
        
        # Get parsed output
        parsed = response.parsed_output
        
        print(f"\n[Parsed {args.schema.title()}]")
        print(parsed.model_dump_json(indent=2))
        
        # Save to file if requested
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(parsed.model_dump(), f, indent=2)
            print(f"\nResult saved to: {args.output}")
        
        print(f"\n[Usage]")
        print(f"Input tokens: {response.usage.input_tokens}")
        print(f"Output tokens: {response.usage.output_tokens}")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
