#!/usr/bin/env python3
"""
Gemini Embeddings Script

Usage: python embed.py "Text to embed" [options]
"""

import argparse
import os
import sys
import json
from google import genai
from google.genai import types


TASK_TYPES = [
    "SEMANTIC_SIMILARITY",
    "CLASSIFICATION",
    "CLUSTERING",
    "RETRIEVAL_DOCUMENT",
    "RETRIEVAL_QUERY",
    "CODE_RETRIEVAL_QUERY",
    "QUESTION_ANSWERING",
    "FACT_VERIFICATION"
]


def parse_args():
    parser = argparse.ArgumentParser(description="Generate embeddings with Gemini")
    parser.add_argument("texts", nargs="+", help="Text(s) to embed")
    parser.add_argument("--model", default="gemini-embedding-001", help="Embedding model")
    parser.add_argument("--task-type", choices=TASK_TYPES, 
                        default="SEMANTIC_SIMILARITY", help="Task type")
    parser.add_argument("--dimension", type=int, default=768, 
                        help="Output dimensionality (128-3072, recommended: 768, 1536, 3072)")
    parser.add_argument("--output", help="Output file for embeddings (JSON)")
    parser.add_argument("--compare", action="store_true", 
                        help="Compare similarity between texts")
    return parser.parse_args()


def cosine_similarity(a, b):
    """Calculate cosine similarity between two vectors."""
    import numpy as np
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is required")
        print("Get your API key at https://aistudio.google.com/apikey")
        sys.exit(1)

    args = parse_args()
    
    client = genai.Client()
    
    try:
        result = client.models.embed_content(
            model=args.model,
            contents=args.texts,
            config=types.EmbedContentConfig(
                task_type=args.task_type,
                output_dimensionality=args.dimension
            )
        )
        
        print(f"\nModel: {args.model}")
        print(f"Task type: {args.task_type}")
        print(f"Dimension: {args.dimension}")
        print(f"Number of embeddings: {len(result.embeddings)}")
        
        embeddings_data = []
        
        for i, embedding in enumerate(result.embeddings):
            text = args.texts[i] if i < len(args.texts) else f"Text {i+1}"
            values = embedding.values
            
            print(f"\n[Embedding {i+1}]")
            print(f"Text: {text[:50]}..." if len(text) > 50 else f"Text: {text}")
            print(f"Length: {len(values)}")
            print(f"First 10 values: {values[:10]}")
            
            embeddings_data.append({
                "text": text,
                "embedding": values
            })
        
        # Compare similarity if requested
        if args.compare and len(embeddings_data) > 1:
            print("\n[Similarity Matrix]")
            try:
                import numpy as np
                
                n = len(embeddings_data)
                matrix = np.zeros((n, n))
                
                for i in range(n):
                    for j in range(n):
                        matrix[i][j] = cosine_similarity(
                            embeddings_data[i]["embedding"],
                            embeddings_data[j]["embedding"]
                        )
                
                # Print header
                header = "          " + "  ".join([f"Text{i+1:6}" for i in range(n)])
                print(header)
                
                for i in range(n):
                    row = f"Text{i+1:6}  "
                    for j in range(n):
                        row += f"{matrix[i][j]:8.4f}"
                    print(row)
                
            except ImportError:
                print("NumPy required for similarity comparison. Install with: pip install numpy")
        
        # Save to file if requested
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(embeddings_data, f, indent=2)
            print(f"\nEmbeddings saved to: {args.output}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
