import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
       Command,
       CommandGroup,
       CommandItem,
       CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Framework = {
       value: string;
       label: string | React.ReactNode;
};

export function MultiSelect({
       selected = [],
       setSelected,
       options = [],
}: {
       selected: string[];
       setSelected: (value: string[]) => void;
       options: Framework[];
}) {
       const inputRef = React.useRef<HTMLInputElement>(null);
       const [open, setOpen] = React.useState(false);
       const [inputValue, setInputValue] = React.useState("");

       const handleUnselect = React.useCallback((framework: string) => {
              setSelected(selected.filter((s) => s !== framework));
       }, [selected, setSelected]);

       const handleKeyDown = React.useCallback(
              (e: React.KeyboardEvent<HTMLDivElement>) => {
                     const input = inputRef.current;
                     if (input) {
                            if (e.key === "Delete" || e.key === "Backspace") {
                                   if (input.value === "" && selected.length > 0) {
                                          const newSelected = [...selected];
                                          newSelected.pop();
                                          setSelected(newSelected);
                                   }
                            }
                            if (e.key === "Escape") {
                                   input.blur();
                            }
                     }
              },
              [selected, setSelected]
       );

       const selectables = options.filter(
              (framework) => !selected.includes(framework.value)
       );

       return (
              <Command
                     onKeyDown={handleKeyDown}
                     className="overflow-visible bg-transparent"
              >
                     <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <div className="flex gap-1 flex-wrap">
                                   {selected.map((framework) => {
                                          const option = options.find((o) => o.value === framework);
                                          return (
                                                 <Badge key={framework} variant="secondary">
                                                        {option ? option.label : framework} {/* Fallback if label not found */}
                                                        <button
                                                               className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                               onKeyDown={(e) => {
                                                                      if (e.key === "Enter") {
                                                                             handleUnselect(framework);
                                                                      }
                                                               }}
                                                               onMouseDown={(e) => {
                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                               }}
                                                               onClick={() => handleUnselect(framework)}
                                                        >
                                                               <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                        </button>
                                                 </Badge>
                                          );
                                   })}
                                   {/* Avoid having the "Search" CommandInput behavior if we just want a simple filter */}
                                   <CommandPrimitive.Input
                                          ref={inputRef}
                                          value={inputValue}
                                          onValueChange={setInputValue}
                                          onBlur={() => setOpen(false)}
                                          onFocus={() => setOpen(true)}
                                          placeholder="Select members..."
                                          className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                                   />
                            </div>
                     </div>
                     <div className="relative mt-2">
                            {open && selectables.length > 0 ? (
                                   <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                          <CommandList>
                                                 {/* 
                     WARNING: `CommandGroup` from shadcn usually expects children.
                     If `selectables` is empty, avoiding rendering empty group.
                 */}
                                                 <CommandGroup className="h-full overflow-auto">
                                                        {selectables.map((framework) => (
                                                               <CommandItem
                                                                      key={framework.value}
                                                                      onMouseDown={(e) => {
                                                                             e.preventDefault();
                                                                             e.stopPropagation();
                                                                      }}
                                                                      onSelect={() => {
                                                                             // Note: value here is the lowercase slug usually, so we need to match carefully or just use the framework.value directly if we trust it matches
                                                                             // But shadcn cmdk filters by value. Let's use framework.value
                                                                             setInputValue("");
                                                                             setSelected([...selected, framework.value]);
                                                                      }}
                                                                      className={"cursor-pointer"}
                                                               >
                                                                      {framework.label}
                                                               </CommandItem>
                                                        ))}
                                                 </CommandGroup>
                                          </CommandList>
                                   </div>
                            ) : null}
                     </div>
              </Command>
       );
}
