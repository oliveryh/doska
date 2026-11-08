import { Button } from "@doska/ui-kit"
import { Settings } from "lucide-react"
import { useState } from "react"
import { AccountsModal } from "@/components/accounts/accounts-modal"
import { SettingsModal } from "./settings-modal"

/** Sidebar entry that opens the settings modal. */
export function SettingsButton() {
  const [open, setOpen] = useState(false)
  const [accountsOpen, setAccountsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Settings"
        className="shrink-0 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Settings />
      </Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        onOpenAccounts={() => {
          // Stacked dialogs trap focus in each other, so settings steps aside.
          setOpen(false)
          setAccountsOpen(true)
        }}
      />
      <AccountsModal open={accountsOpen} onOpenChange={setAccountsOpen} />
    </>
  )
}
