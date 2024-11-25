import { ArrowUpRight, Sparkles, User } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { DEFAULT_PROMPTS } from "../lib/prompts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "../lib/schema";
import { z } from "zod";
import { CommandSeparator } from "cmdk";

type Store = {
  promptType: string;
  prompt: string;
  response: string;
  createdAt: string;
  websiteURL: string;
};

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

export const CommandModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [websiteURL, setWebsiteURL] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptType: "",
    },
  });
  const saveResponseToLocalStorage = (
    response: string,
    promptType: string,
    selectedText: string,
  ) => {
    const store: Store = {
      promptType,
      prompt: selectedText,
      response,
      createdAt: new Date().toISOString(),
      websiteURL: websiteURL,
    };
    localStorage.setItem("response", JSON.stringify(store));
  };

  const onSubmit = async ({ promptType }: z.infer<typeof formSchema>) => {
    const storedSelectedText = localStorage.getItem("selectedText") || "";
    // Debugging statement
    console.log("Submitting with selectedText:", storedSelectedText);
    setWebsiteURL(window.location.href);
    setLoading(true);
    setResponse(null);
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
          variables: {
            promptType: promptType,
            prompt: storedSelectedText,
          },
        }),
      });
      const result = await res.json();
      setResponse(result.data.askAI);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(JSON.parse(localStorage.getItem("conversation") || "[]"));

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
      {/* {showButton && (
        <Button
          style={{ position: "absolute", top: buttonPosition.top, left: buttonPosition.left }}
          onClick={() => setOpen(true)}
          className="z-[1000]"
        >
        <Sparkles height={4} width={4} className="text-violet-500/20" />  
        </Button>
      )} */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        {loading ? (
          <div className="p-4">AI is typing...</div>
        ) : response ? (
          <article className="p-4 prose">{response}</article>
        ) : (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
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
        <CommandSeparator />
        <div className="text-sm border-t px-4 py-1 text-muted-foreground flex justify-between items-center">
          <span>Developed By Mahendra</span>
          <div className="flex justify-center items-center gap-3 hover:text-gray-800">{SOCIALS.map((social,i)=>(
            <div className="flex justify-center items-center gap-1">
              <a key={i} href={social.handle} target="_blank">{social.name}</a>
              <ArrowUpRight height={12} width={12} className="text-muted-foreground hover:text-gray-800" />
            </div>
          ))}</div>
        </div>
      </CommandDialog>
    </>
  );
};
