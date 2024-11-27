import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sparkles, ArrowLeft } from "lucide-react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "../components/ui/command";
import { Button } from "../components/ui/button";
import { CommandSeparator } from "cmdk";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DEFAULT_PROMPTS } from "../lib/prompts";
import { formSchema } from "../lib/schema";

const SOCIALS = [
  {
    name: "GitHub",
    username: "@MahendraDani",
    handle: "https://github.com/MahendraDani",
  },
  {
    name: "Linkedin",
    username: "@mahendra-dani",
    handle: "https://linkedin.com/in/mahendra-dani",
  },
  {
    name: "Hashnode",
    username: "@Mahendra09",
    handle: "https://hashnode.com/@Mahendra09",
  },
];

type Store = {
  promptType: string;
  prompt: string;
  response: string;
  createdAt: string;
  websiteURL: string;
};

const SocialLinks = () => (
  <div className="flex justify-center items-center gap-3 hover:text-gray-800">
    {SOCIALS.map((social, i) => (
      <div key={i} className="flex justify-center items-center gap-1">
        <a href={social.handle} target="_blank" rel="noopener noreferrer">
          {social.name}
        </a>
        <ArrowUpRight height={12} width={12} className="text-muted-foreground hover:text-gray-800" />
      </div>
    ))}
  </div>
);

export const CommandModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showCommands, setShowCommands] = useState(true);
  const [showCustomPromptInput, setShowCustomPromptInput] = useState(false);

  const queryAI = async (promptType: string, prompt: string) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:8686/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.WXT_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            query AskAI($promptType: String!, $prompt: String!) {
              askAI(promptType: $promptType, prompt: $prompt)
            }
          `,
          variables: { promptType, prompt },
        }),
      });

      const result = await res.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      saveResponseToLocalStorage(result.data.askAI, promptType, prompt);
      setResponse(result.data.askAI);
    } catch (error) {
      console.error("Error:", error);
      setError("Oops! Someting went wrong please try again!");
    } finally {
      setLoading(false);
    }
  };

  const saveResponseToLocalStorage = (
    response: string, 
    promptType: string, 
    prompt: string
  ) => {
    const store: Store = {
      promptType,
      prompt,
      response,
      createdAt: new Date().toISOString(),
      websiteURL: window.location.href,
    };
  
    const existingResponses = JSON.parse(localStorage.getItem("responses") || "[]");
    existingResponses.push(store);
    localStorage.setItem("responses", JSON.stringify(existingResponses));
  };

  const handleCommandItemClick = (promptType: string) => {
    const storedSelectedText = localStorage.getItem("selectedText") || "";
    const finalPrompt = promptType === "CUSTOM_PROMPT" 
      ? `${storedSelectedText} ${customPrompt}` 
      : storedSelectedText;

    queryAI(promptType, finalPrompt);
    setShowCommands(false);
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
        setButtonPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setShowButton(true);
      } else {
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
        setSelectedText("");
        setResponse(null);
        setOpen(false);
        setShowCustomPromptInput(false);
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
          className="z-[1000]"
        >
          <Sparkles />
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setResponse(null);
            setError(null);
            setCustomPrompt("");
            setShowCommands(true);
          }
        }}
      >
        {showCustomPromptInput ? 
        <div>
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <input
            placeholder="Type a custom prompt..."
            className={
              "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // call api for custom prompt
                handleCommandItemClick("CUSTOM_PROMPT");
                setShowCustomPromptInput(false);
          console.log(e.currentTarget.value);
              }
            }}
          />
        </div>

        <div className="px-3 py-2 text-sm text-muted-foreground">
          {selectedText}
        </div>
        
        </div>
        :
        <div>

          <CommandInput
          showBackButton={true}
          placeholder="Type a command or search..."
        />
        {loading ? (
          <div className="w-full p-2 text-sm text-center">AI is typing...</div>
        ) : error ? (
          <div className="w-full p-2 text-sm text-center text-red-500">{error}</div>
        ) : response ? (
          <section className="p-2 space-y-1 text-sm">
            <div>
              <div className="text-muted-foreground">Text</div>
              <div className="text-secondary-foreground">{selectedText.slice(0,100)} {"..."}</div>
            </div>
            <div>
              <div className="text-muted-foreground">AI</div>
              <div className="">{response}</div>
            </div>
          </section>
        ) : (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Custom">
              <CommandItem
                onSelect={() => setShowCustomPromptInput(true) }
              >
              <Sparkles
                    height={4}
                    width={4}
                    className="text-violet-500/20"
                  />
                  <span>Write a custom prompt</span>

              </CommandItem>
              </CommandGroup>
            <CommandGroup heading="Suggestions">
              {DEFAULT_PROMPTS.map((prompt, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => handleCommandItemClick(prompt.promptType)}
                >
                  <Sparkles
                    height={4}
                    width={4}
                    className="text-violet-500/20"
                  />
                  <span>{prompt.text}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}

        </div>
        }
        <CommandSeparator />
        <div className="text-sm border-t px-4 py-1 text-muted-foreground flex justify-between items-center">
          <span>Developed By Mahendra</span>
          <SocialLinks />
        </div>
      </CommandDialog>
    </>
  );
};

/*
TODO
- [x] Custom prompt and default prompt working
- [x] store all conversation in localstorage
- [ ] disable text selection event when modal's -> tried but didn't work
- [x] make a common UI for showing AI response for both default and custom prompt - error, loading and success states
- [ ] add a command to show history which shows previous conversations for that particular website
*/