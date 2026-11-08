import { Button } from "@doska/ui-kit"
import { Search } from "lucide-react"
import { useOpenSearch } from "@/providers/search/search-context"

export function SearchButton() {
  const openSearch = useOpenSearch()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Search cards"
      className="text-muted-foreground"
      onClick={openSearch}
    >
      <Search />
    </Button>
  )
}
