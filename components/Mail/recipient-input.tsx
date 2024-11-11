"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Recipient {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface RecipientInputProps {
  label: string;
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  onSearch: (query: string) => Promise<Recipient[]>;
}

export function RecipientInput({
  label,
  recipients,
  onRecipientsChange,
  onSearch,
}: RecipientInputProps) {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Recipient[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      try {
        const results = await onSearch(value);
        setSuggestions(
          results.filter((result) => !recipients.some((r) => r.id === result.id))
        );
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addRecipient = (recipient: Recipient) => {
    onRecipientsChange([...recipients, recipient]);
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeRecipient = (recipientId: string) => {
    onRecipientsChange(recipients.filter((r) => r.id !== recipientId));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem]">
        {recipients.map((recipient) => (
          <Badge key={recipient.id} variant="secondary" className="h-6">
            <Avatar className="h-4 w-4 mr-1">
              <AvatarImage src={recipient.image || undefined} />
              <AvatarFallback>
                {recipient.name?.[0] || recipient.email?.[0]}
              </AvatarFallback>
            </Avatar>
            {recipient.name || recipient.email}
            <button
              type="button"
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeRecipient(recipient.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </button>
          </Badge>
        ))}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            placeholder={recipients.length === 0 ? label : ""}
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-[400px] mt-1 z-50 bg-popover text-popover-foreground shadow-md rounded-md border">
              <Command>
                <CommandList>
                  <CommandEmpty>No recipients found.</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.id}
                        onSelect={() => addRecipient(suggestion)}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={suggestion.image || undefined} />
                          <AvatarFallback>
                            {suggestion.name?.[0] || suggestion.email?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{suggestion.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {suggestion.email}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            recipients.some((r) => r.id === suggestion.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}