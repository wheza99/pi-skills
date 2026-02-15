---
name: shadcn-ui
description: Skill untuk development dengan shadcn/ui component library. Gunakan ketika membuat komponen UI, form, dialog, tabel, atau custom design system dengan Next.js/React.
---

# shadcn/ui Development Skill

shadcn/ui adalah kumpulan komponen yang beautifully-designed, accessible, dan dapat dikustomisasi penuh. Bukan library tradisional - kamu memiliki kode komponen sepenuhnya.

## Prinsip Utama

- **Open Code**: Kode komponen bisa dimodifikasi langsung
- **Composition**: Interface yang composable dan predictable
- **Distribution**: CLI untuk distribusi komponen cross-framework
- **Beautiful Defaults**: Default styles yang sudah bagus
- **AI-Ready**: Kode terbuka untuk LLM memahami dan improve

## Installation

### Quick Start (Next.js)

```bash
# Buat project Next.js (jika belum)
npx create-next-app@latest my-app --typescript --tailwind --eslint

# Masuk ke direktori
cd my-app

# Initialize shadcn/ui
npx shadcn@latest init
```

### Opsi Init

```bash
# Dengan konfigurasi specific
npx shadcn@latest init -d          # Default style
npx shadcn@latest init -y          # Yes ke semua
npx shadcn@latest init --style default   # Style: default, new-york
```

### Framework Lain

```bash
# Vite
npx shadcn@latest init

# Remix
npx shadcn@latest init

# Gatsby
npx shadcn@latest init

# Astro
npx shadcn@latest init

# Laravel
npx shadcn@latest init
```

## Menambah Komponen

### Tambah Komponen Individual

```bash
# Tambah satu komponen
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Tambah multiple komponen
npx shadcn@latest add button card dialog input

# Tambah semua komponen
npx shadcn@latest add --all

# Overwrite existing
npx shadcn@latest add button --overwrite
```

### Daftar Komponen Tersedia

| Komponen | Command |
|----------|---------|
| Accordion | `npx shadcn@latest add accordion` |
| Alert | `npx shadcn@latest add alert` |
| Alert Dialog | `npx shadcn@latest add alert-dialog` |
| Aspect Ratio | `npx shadcn@latest add aspect-ratio` |
| Avatar | `npx shadcn@latest add avatar` |
| Badge | `npx shadcn@latest add badge` |
| Breadcrumb | `npx shadcn@latest add breadcrumb` |
| Button | `npx shadcn@latest add button` |
| Calendar | `npx shadcn@latest add calendar` |
| Card | `npx shadcn@latest add card` |
| Carousel | `npx shadcn@latest add carousel` |
| Chart | `npx shadcn@latest add chart` |
| Checkbox | `npx shadcn@latest add checkbox` |
| Collapsible | `npx shadcn@latest add collapsible` |
| Combobox | `npx shadcn@latest add combobox` |
| Command | `npx shadcn@latest add command` |
| Context Menu | `npx shadcn@latest add context-menu` |
| Data Table | `npx shadcn@latest add data-table` |
| Date Picker | `npx shadcn@latest add date-picker` |
| Dialog | `npx shadcn@latest add dialog` |
| Drawer | `npx shadcn@latest add drawer` |
| Dropdown Menu | `npx shadcn@latest add dropdown-menu` |
| Form | `npx shadcn@latest add form` |
| Hover Card | `npx shadcn@latest add hover-card` |
| Input | `npx shadcn@latest add input` |
| Input OTP | `npx shadcn@latest add input-otp` |
| Label | `npx shadcn@latest add label` |
| Menubar | `npx shadcn@latest add menubar` |
| Navigation Menu | `npx shadcn@latest add navigation-menu` |
| Pagination | `npx shadcn@latest add pagination` |
| Popover | `npx shadcn@latest add popover` |
| Progress | `npx shadcn@latest add progress` |
| Radio Group | `npx shadcn@latest add radio-group` |
| Resizable | `npx shadcn@latest add resizable` |
| Scroll Area | `npx shadcn@latest add scroll-area` |
| Select | `npx shadcn@latest add select` |
| Separator | `npx shadcn@latest add separator` |
| Sheet | `npx shadcn@latest add sheet` |
| Sidebar | `npx shadcn@latest add sidebar` |
| Skeleton | `npx shadcn@latest add skeleton` |
| Slider | `npx shadcn@latest add slider` |
| Sonner (Toast) | `npx shadcn@latest add sonner` |
| Switch | `npx shadcn@latest add switch` |
| Table | `npx shadcn@latest add table` |
| Tabs | `npx shadcn@latest add tabs` |
| Textarea | `npx shadcn@latest add textarea` |
| Toast | `npx shadcn@latest add toast` |
| Toggle | `npx shadcn@latest add toggle` |
| Tooltip | `npx shadcn@latest add tooltip` |

## Struktur File

```
project/
├── components/
│   └── ui/           # Komponen shadcn di sini
│       ├── button.tsx
│       ├── card.tsx
│       └── dialog.tsx
├── lib/
│   └── utils.ts      # Utility functions (cn, dll)
├── components.json   # Konfigurasi shadcn
└── app/
    └── globals.css   # CSS variables
```

## Komponen Populer

### Button

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🎯</Button>

// With icon
<Button>
  <Mail className="mr-2 h-4 w-4" /> Login with Email
</Button>
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Input

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings here.</TabsContent>
  <TabsContent value="password">Password settings here.</TabsContent>
</Tabs>
```

### Toast / Sonner

```tsx
import { toast } from "sonner"

// Basic
toast("Message here")

// With description
toast("Event created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
})

// Success/Error
toast.success("Successfully saved!")
toast.error("Something went wrong!")

// With action
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
})
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Sheet (Side Panel)

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Skeleton (Loading)

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

### Badge

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Forms dengan React Hook Form

### Setup

```bash
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add button
```

```bash
npm install zod react-hook-form @hookform/resolvers
```

### Contoh Form

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Data Table

### Setup

```bash
npx shadcn@latest add data-table
npm install @tanstack/react-table
```

### Penggunaan

```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]

const data: Payment[] = [
  { id: "1", status: "success", email: "a@example.com", amount: 100 },
  // ...
]

export function PaymentsTable() {
  return <DataTable columns={columns} data={data} />
}
```

## Theming

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode values */
  }
}
```

### Dark Mode Toggle

```tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

## CLI Commands

```bash
# Initialize
npx shadcn@latest init

# Add component
npx shadcn@latest add [component]

# Add all components
npx shadcn@latest add --all

# Overwrite existing
npx shadcn@latest add [component] --overwrite

# List available components
npx shadcn@latest add

# Add from URL/registry
npx shadcn@latest add [url]

# Diff (check changes before updating)
npx shadcn@latest diff

# Init with specific path
npx shadcn@latest init --path src/components
```

## components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Utility Function (utils.ts)

```tsx
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Tips & Best Practices

1. **Modifikasi Komponen**: Edit langsung file di `components/ui/` untuk custom behavior
2. **Gunakan `cn()`**: Untuk merge Tailwind classes dengan kondisional
3. **Composition**: Komponen shadcn menggunakan Radix UI, gunakan pattern composition
4. **Accessibility**: Radix UI handles a11y, jangan override ARIA attributes
5. **Theming**: Gunakan CSS variables untuk konsistensi theming
6. **Update**: Gunakan `npx shadcn@latest diff` sebelum update untuk cek changes

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Module not found | Pastikan path alias di tsconfig.json benar |
| Styles tidak muncul | Import globals.css di layout.tsx |
| Hydration error | Pastikan client components dengan `'use client'` |
| Types error | Run `npm install` untuk update types |

## Resources

- [Official Docs](https://ui.shadcn.com/docs)
- [Components Directory](https://ui.shadcn.com/docs/components)
- [Blocks](https://ui.shadcn.com/blocks) - Pre-built page sections
- [Charts](https://ui.shadcn.com/charts) - Chart components
- [Figma Kit](https://ui.shadcn.com/docs/figma)
- [llms.txt](https://ui.shadcn.com/llms.txt) - For AI tools
