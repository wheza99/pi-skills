# Gemini Function Calling

## Overview

Function calling memungkinkan Gemini terhubung ke external tools dan APIs. Model tidak mengeksekusi fungsi secara langsung, tetapi memberikan saran function call yang kemudian dieksekusi oleh aplikasi.

## Use Cases

1. **Augment Knowledge** - Akses info dari database, APIs, knowledge bases
2. **Extend Capabilities** - Kalkulasi, charts, tools eksternal
3. **Take Actions** - Interaksi dengan sistem eksternal

## Alur Function Calling

1. **Define Function Declaration** - Definisikan fungsi dan parameternya
2. **Call Model dengan Functions** - Kirim prompt + function declarations
3. **Execute Function** - Jika model request function call, eksekusi lokal
4. **Return Result** - Kirim hasil kembali ke model untuk final response

## Basic Example

```python
from google import genai
from google.genai import types

# Step 1: Define function declaration
schedule_meeting_function = {
    "name": "schedule_meeting",
    "description": "Schedules a meeting with specified attendees",
    "parameters": {
        "type": "object",
        "properties": {
            "attendees": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of people attending"
            },
            "date": {
                "type": "string",
                "description": "Date of the meeting (e.g., '2024-07-29')"
            },
            "time": {
                "type": "string",
                "description": "Time of the meeting (e.g., '15:00')"
            },
            "topic": {
                "type": "string",
                "description": "The subject of the meeting"
            }
        },
        "required": ["attendees", "date", "time", "topic"]
    }
}

# Step 2: Call model with functions
client = genai.Client()
tools = types.Tool(function_declarations=[schedule_meeting_function])
config = types.GenerateContentConfig(tools=[tools])

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about Q3 planning.",
    config=config
)

# Step 3: Check for function call
if response.candidates[0].content.parts[0].function_call:
    fc = response.candidates[0].content.parts[0].function_call
    print(f"Function: {fc.name}")
    print(f"Arguments: {fc.args}")
    # Execute function locally...
```

## Automatic Function Calling (Python)

Python SDK mendukung automatic function calling:

```python
from google import genai
from google.genai import types

# Define actual Python function
def get_current_temperature(location: str) -> dict:
    """Gets the current temperature for a given location.
    
    Args:
        location: The city and state, e.g. San Francisco, CA
    
    Returns:
        A dictionary containing the temperature and unit.
    """
    # Call weather API...
    return {"temperature": 25, "unit": "Celsius"}

# Pass function directly as tool
client = genai.Client()
config = types.GenerateContentConfig(tools=[get_current_temperature])

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What's the temperature in Boston?",
    config=config
)

print(response.text)  # SDK handles function execution automatically
```

## Function Declaration Schema

```typescript
type FunctionDeclaration = {
  name: string;           // Function name (no spaces, use camelCase or underscores)
  description: string;    // Clear description of what the function does
  parameters: {
    type: "object";
    properties: {
      [paramName: string]: {
        type: string;     // "string", "integer", "number", "boolean", "array"
        description: string;
        enum?: string[];  // For fixed set of values
      };
    };
    required: string[];   // Required parameters
  };
};
```

## Function Calling Modes

```python
from google.genai import types

tool_config = types.ToolConfig(
    function_calling_config=types.FunctionCallingConfig(
        mode="AUTO"  # AUTO, ANY, NONE, or VALIDATED
    )
)
```

| Mode | Description |
|------|-------------|
| `AUTO` | Model decides when to call functions (default) |
| `ANY` | Always call a function |
| `NONE` | Disable function calling |
| `VALIDATED` | Function call or text, with schema validation |

## Parallel Function Calling

```python
# Multiple functions can be called in parallel
power_disco_ball = {
    "name": "power_disco_ball",
    "description": "Powers the spinning disco ball",
    "parameters": {
        "type": "object",
        "properties": {
            "power": {"type": "boolean"}
        },
        "required": ["power"]
    }
}

start_music = {
    "name": "start_music",
    "description": "Play music matching specified parameters",
    "parameters": {
        "type": "object",
        "properties": {
            "energetic": {"type": "boolean"},
            "loud": {"type": "boolean"}
        },
        "required": ["energetic", "loud"]
    }
}

dim_lights = {
    "name": "dim_lights",
    "description": "Dim the lights",
    "parameters": {
        "type": "object",
        "properties": {
            "brightness": {"type": "number"}
        },
        "required": ["brightness"]
    }
}

tools = types.Tool(function_declarations=[power_disco_ball, start_music, dim_lights])
config = types.GenerateContentConfig(
    tools=[tools],
    tool_config=types.ToolConfig(
        function_calling_config=types.FunctionCallingConfig(mode='ANY')
    )
)

response = chat.send_message("Turn this place into a party!")

# Multiple function calls returned
for fn in response.function_calls:
    print(f"{fn.name}({fn.args})")
```

## Compositional Function Calling

Chaining multiple function calls:

```python
def get_weather_forecast(location: str) -> dict:
    """Gets the current weather temperature for a given location."""
    return {"temperature": 25, "unit": "celsius"}

def set_thermostat_temperature(temperature: int) -> dict:
    """Sets the thermostat to a desired temperature."""
    return {"status": "success"}

config = types.GenerateContentConfig(
    tools=[get_weather_forecast, set_thermostat_temperature]
)

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise set it to 18°C.",
    config=config
)

# Model will first call get_weather_forecast, then set_thermostat_temperature
print(response.text)
```

## Sending Function Results Back

```python
from google import genai
from google.genai import types

# Initial request
contents = [types.Content(role="user", parts=[types.Part(text="What's the weather in Tokyo?")])]

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=contents,
    config=config
)

# Get function call
tool_call = response.candidates[0].content.parts[0].function_call

if tool_call.name == "get_weather":
    result = get_weather(**tool_call.args)
    
    # Append function call and result to conversation
    contents.append(response.candidates[0].content)  # Model's function call
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_function_response(
            name=tool_call.name,
            response=result
        )]
    ))
    
    # Get final response
    final_response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=contents,
        config=config
    )
    
    print(final_response.text)
```

## Thought Signatures

For multi-turn conversations with thinking models, thought signatures preserve reasoning context:

```python
# The SDK handles thought signatures automatically
# But if you're manually managing history:

# Rule 1: Always send thought_signature back in its original Part
# Rule 2: Don't merge Parts with signatures with Parts without
# Rule 3: Don't combine two Parts that both contain signatures

# Inspect thought signature
import base64
part = response.candidates[0].content.parts[0]
if part.thought_signature:
    print(base64.b64encode(part.thought_signature).decode("utf-8"))
```

## Multimodal Function Responses (Gemini 3)

```python
from google import genai
from google.genai import types

# Function can return multimodal content
function_response_data = {
    "image_ref": {"$ref": "instrument.jpg"},
}

function_response_multimodal_data = types.FunctionResponsePart(
    inline_data=types.FunctionResponseBlob(
        mime_type="image/jpeg",
        display_name="instrument.jpg",
        data=image_bytes,
    )
)

contents.append(types.Content(
    role="tool",
    parts=[
        types.Part.from_function_response(
            name=function_call.name,
            response=function_response_data,
            parts=[function_response_multimodal_data]
        )
    ],
))
```

## Model Support

| Model | Function Calling | Parallel | Compositional |
|-------|-----------------|----------|---------------|
| Gemini 3 Pro | ✅ | ✅ | ✅ |
| Gemini 3 Flash | ✅ | ✅ | ✅ |
| Gemini 2.5 Pro | ✅ | ✅ | ✅ |
| Gemini 2.5 Flash | ✅ | ✅ | ✅ |
| Gemini 2.5 Flash-Lite | ✅ | ✅ | ✅ |

## Best Practices

1. **Clear Descriptions** - Jelaskan fungsi dengan detail
2. **Descriptive Names** - Gunakan nama fungsi yang jelas
3. **Strong Typing** - Gunakan tipe spesifik (integer, string, enum)
4. **Limit Tools** - Idealnya 10-20 tools aktif
5. **Low Temperature** - Gunakan temperature rendah untuk konsistensi
6. **Error Handling** - Handle errors dengan informatif messages
7. **Validation** - Validasi function calls sebelum eksekusi

## MCP (Model Context Protocol)

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="npx",
    args=["-y", "@philschmid/weather-mcp"],
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents="What is the weather in London?",
            config=genai.types.GenerateContentConfig(
                tools=[session],  # Pass MCP session
            ),
        )
```
