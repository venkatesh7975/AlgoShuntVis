import { ThemeToggle } from "./theme-toggle"
import { AlgoShuntIcon } from "./icons"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <AlgoShuntIcon className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">AlgoShunt</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
