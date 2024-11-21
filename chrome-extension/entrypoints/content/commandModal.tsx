import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  Sparkles,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/ui/command";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { DEFAULT_PROMPTS } from "../lib/prompts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "../lib/schema";
import { z } from "zod";


export const CommandModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptType: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const storedSelectedText = localStorage.getItem("selectedText") || "";
    console.log("Submitting with selectedText:", storedSelectedText); // Debugging statement
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('http://localhost:8686/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${import.meta.env.WXT_API_KEY}`
        },
        body: JSON.stringify({
          query: `
            query AskAI($promptType: String!, $prompt: String!) {
              askAI(promptType: $promptType, prompt: $prompt)
            }
          `,
          variables: {
            promptType: data.promptType,
            prompt: storedSelectedText,
          },
        }),
      });
      const result = await res.json();
      setResponse(result.data.askAI);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommandItemClick = (promptType: string) => {
    form.setValue("promptType", promptType);
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const selectedText = selection.toString();
        setSelectedText(selectedText);
        localStorage.setItem("selectedText", selectedText);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setButtonPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
        setShowButton(true);
      } else {
        // console.log("I am running")
        // setSelectedText("");
        // localStorage.removeItem("selectedText");
        setShowButton(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (selectedText) {
          setOpen(true);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedText]);

  return (
    <>
      {showButton && (
        <Button
          style={{ position: "absolute", top: buttonPosition.top, left: buttonPosition.left }}
          onClick={() => setOpen(true)}
        >
          Open Command
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        {loading ? (
          <div className="p-4">AI is typing...</div>
        ) : response ? (
          <div className="p-4 prose">{response}</div>
        ) : (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {DEFAULT_PROMPTS.map((prompt, i) => (
                <CommandItem key={i} onSelect={() => handleCommandItemClick(prompt.promptType)}>
                  <Calendar />
                  <span>{prompt.text}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User />
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
};