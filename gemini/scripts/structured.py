#!/usr/bin/env python3
"""
Gemini Structured Output Demo

Usage: python structured.py "Extract recipe from: ..." [options]
"""

import argparse
import os
import sys
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional


# Example schemas
class Ingredient(BaseModel):
    name: str = Field(description="Name of the ingredient")
    quantity: str = Field(description="Quantity with units")


class Recipe(BaseModel):
    recipe_name: str = Field(description="Name of the recipe")
    prep_time_minutes: Optional[int] = Field(description="Preparation time in minutes")
    ingredients: List[Ingredient] = Field(description="List of ingredients")
    instructions: List[str] = Field(description="Step-by-step instructions")


class Person(BaseModel):
    name: str = Field(description="Full name")
    age: int = Field(description="Age in years")
    occupation: str = Field(description="Job or profession")
    skills: List[str] = Field(description="List of skills")


class Product(BaseModel):
    name: str = Field(description="Product name")
    price: float = Field(description="Price in USD")
    category: str = Field(description="Product category")
    in_stock: bool = Field(description="Whether the product is in stock")
    tags: List[str] = Field(description="Product tags")


SCHEMAS = {
    "recipe": Recipe,
    "person": Person,
    "product": Product
}


def parse_args():
    parser = argparse.ArgumentParser(description="Structured output with Gemini")
    parser.add_argument("prompt", help="The prompt to send to Gemini")
    parser.add_argument("--model", default="gemini-3-flash-preview", help="Model to use")
    parser.add_argument("--schema", choices=list(SCHEMAS.keys()), default="recipe",
                        help="Schema to use for structured output")
    parser.add_argument("--custom-schema", help="Custom JSON schema as string")
    parser.add_argument("--output", help="Output file for result (JSON)")
    return parser.parse_args()


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is required")
        print("Get your API key at https://aistudio.google.com/apikey")
        sys.exit(1)

    args = parse_args()
    
    client = genai.Client()
    
    # Get schema
    if args.custom_schema:
        try:
            schema_dict = json.loads(args.custom_schema)
        except json.JSONDecodeError:
            print("Error: Invalid JSON schema")
            sys.exit(1)
    else:
        schema_class = SCHEMAS[args.schema]
        schema_dict = schema_class.model_json_schema()
    
    print(f"\n[Schema] {args.schema}")
    print(f"[Model] {args.model}")
    print(f"\n[Prompt] {args.prompt[:100]}..." if len(args.prompt) > 100 else f"\n[Prompt] {args.prompt}")
    
    try:
        response = client.models.generate_content(
            model=args.model,
            contents=args.prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": schema_dict
            }
        )
        
        print("\n[Raw Response]")
        print(response.text)
        
        # Validate with Pydantic if using predefined schema
        if not args.custom_schema:
            try:
                schema_class = SCHEMAS[args.schema]
                validated = schema_class.model_validate_json(response.text)
                
                print(f"\n[Validated {args.schema.title()}]")
                print(validated.model_dump_json(indent=2))
                
                result = validated.model_dump()
            except Exception as e:
                print(f"\n[Validation Error] {e}")
                result = json.loads(response.text)
        else:
            result = json.loads(response.text)
        
        # Save to file if requested
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\nResult saved to: {args.output}")
        
        # Usage info
        if hasattr(response, 'usage_metadata'):
            print(f"\n[Usage]")
            print(f"Prompt tokens: {response.usage_metadata.prompt_token_count}")
            print(f"Completion tokens: {response.usage_metadata.candidates_token_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
