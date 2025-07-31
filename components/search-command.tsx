"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { Search } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import {
  Building2,
  Users,
  MapPin,
  MessageSquare,
  BookOpen,
  Trophy,
  Banknote,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SearchCommand({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [filteredResults, setFilteredResults] = React.useState<any[]>([]) // Assuming the command items are of type any

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // Ensure proper keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(filteredResults[selectedIndex])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false) // Use setOpen to close the dialog
    }
  }

  const handleSelect = (item: any) => {
    runCommand(() => router.push(item.href)) // Assuming each item has a href property
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="relative h-9 w-9 p-0 rounded-full" onClick={() => setOpen(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
              <span className="absolute -bottom-0.5 -right-0.5 text-[10px] bg-primary text-primary-foreground rounded-full px-1">
                ⌘K
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search (⌘K)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <Command
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
            onKeyDown={handleKeyDown}
          >
            <CommandInput placeholder="Search across pLantum..." value={value} onValueChange={setValue} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => runCommand(() => router.push("/startups"))}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Startups</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/investors"))}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Investors</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/map"))}>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Ecosystem Map</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/discussions"))}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Discussions</span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Resources">
                <CommandItem onSelect={() => runCommand(() => router.push("/resources"))}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Resource Library</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/leaderboard"))}>
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/claim-r100k"))}>
                  <Banknote className="mr-2 h-4 w-4" />
                  <span>Claim R100K</span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Account">
                <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/login"))}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/signup"))}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Sign Up</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandInputProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  value: string
  onValueChange: (value: string) => void
}

const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, CommandInputProps>(
  ({ className, value, onValueChange, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
    </div>
  ),
)

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />)

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

