"use client"

import { useState } from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchProps {
  onSearch: (query: string, filter: string) => void
  placeholder?: string
}

export function Search({ onSearch, placeholder = "Search..." }: SearchProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const handleSearch = () => {
    onSearch(query, filter)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("", filter)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-8"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1 h-6 w-6"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="whitespace-nowrap">
            {filter === "all" ? "All" : filter === "startups" ? "Startups" : "Investors"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("startups")}>Startups</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("investors")}>Investors</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}

