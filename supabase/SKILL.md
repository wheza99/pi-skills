---
name: supabase
description: Skill untuk membantu development dengan Supabase - PostgreSQL database, Authentication, Storage, Realtime, Edge Functions, dan AI/Vectors. Gunakan ketika user ingin setup project Supabase, implementasi auth, query database, atau menggunakan fitur Supabase lainnya.
---

# Supabase Development

Skill ini membantu development dengan Supabase, platform backend-as-a-service yang menyediakan PostgreSQL database, Authentication, Storage, Realtime, Edge Functions, dan AI/Vectors.

## Setup

### Install Supabase CLI

```bash
# Menggunakan npm
npm install supabase --save-dev

# Menggunakan brew (macOS)
brew install supabase/tap/supabase
```

### Install Client SDK

```bash
# JavaScript/TypeScript
npm install @supabase/supabase-js

# Python
pip install supabase

# Flutter
flutter pub add supabase_flutter
```

## Inisialisasi Project

### Local Development

```bash
# Inisialisasi project Supabase
npx supabase init

# Start local development stack
npx supabase start

# View local instance di http://localhost:54323
```

### Initialize Client (JavaScript)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Fitur Utama

### Database (PostgreSQL)

Lihat [Database Guide](references/database.md) untuk detail.

```typescript
// Fetch data
const { data, error } = await supabase
  .from('users')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'John', email: 'john@example.com' }])

// Update data
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1)

// Delete data
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1)
```

### Authentication

Lihat [Auth Guide](references/auth.md) untuk detail.

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in with OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

// Sign out
const { error } = await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Storage

Lihat [Storage Guide](references/storage.md) untuk detail.

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/file.jpg', file)

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('path/file.jpg')

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/file.jpg')
```

### Realtime

Lihat [Realtime Guide](references/realtime.md) untuk detail.

```typescript
// Subscribe to database changes
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'users' },
    (payload) => console.log(payload)
  )
  .subscribe()

// Broadcast messages
const channel = supabase.channel('room1')
channel.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: { content: 'Hello!' }
    })
  }
})

// Presence (track online users)
const channel = supabase.channel('online-users')
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    console.log(state)
  })
  .subscribe()
```

### Edge Functions

Lihat [Edge Functions Guide](references/edge-functions.md) untuk detail.

```bash
# Create new function
npx supabase functions new my-function

# Serve function locally
npx supabase functions serve

# Deploy function
npx supabase functions deploy my-function
```

```typescript
// Invoke Edge Function
const { data, error } = await supabase.functions.invoke('my-function', {
  body: { key: 'value' }
})
```

### AI & Vectors

Lihat [AI & Vectors Guide](references/ai-vectors.md) untuk detail.

```sql
-- Enable pgvector extension
create extension if not exists vector;

-- Create table with vector column
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);

-- Create index for similarity search
create index on documents using ivfflat (embedding vector_cosine_ops);
```

```typescript
// Vector similarity search
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding,
  match_threshold: 0.7,
  match_count: 10
})
```

## CLI Commands

```bash
# Project management
npx supabase init                  # Initialize project
npx supabase start                 # Start local stack
npx supabase stop                  # Stop local stack
npx supabase status                # Show status

# Database
npx supabase db reset              # Reset database
npx supabase db push               # Push migrations
npx supabase db pull               # Pull schema changes
npx supabase migration new <name>  # Create migration

# Functions
npx supabase functions new <name>  # Create function
npx supabase functions serve       # Serve locally
npx supabase functions deploy <name>  # Deploy

# Types
npx supabase gen types typescript --local > types/supabase.ts
```

## Row Level Security (RLS)

```sql
-- Enable RLS
alter table users enable row level security;

-- Policy for authenticated users
create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);

-- Policy for public read
create policy "Public read access"
  on posts for select
  using (true);

-- Policy for insert
create policy "Users can insert own data"
  on users for insert
  with check (auth.uid() = id);
```

## Referensi

- [Database Guide](references/database.md) - PostgreSQL database operations
- [Auth Guide](references/auth.md) - Authentication methods
- [Storage Guide](references/storage.md) - File storage operations
- [Realtime Guide](references/realtime.md) - Realtime subscriptions
- [Edge Functions Guide](references/edge-functions.md) - Serverless functions
- [AI & Vectors Guide](references/ai-vectors.md) - Vector embeddings & AI

## Links

- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- GitHub: https://github.com/supabase/supabase
- Discord: https://discord.supabase.com
