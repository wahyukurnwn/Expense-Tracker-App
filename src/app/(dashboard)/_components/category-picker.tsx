"use client";

import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateCategoryDialog } from "./create-category-dialog";
import { Category } from "@/generated/prisma-client/client";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

export const CategoryPicker = ({ type, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValue, setIsValue] = useState("");

  useEffect(() => {
    if (!isValue) return;
    onChange(isValue); // when the value changes, call the onChange callback
  }, [onChange, isValue]);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const successCallback = useCallback(
    (category: Category) => {
      setIsValue(category.name);
      setIsOpen((prev) => !prev);
    },
    [setIsValue, setIsOpen]
  );

  const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === isValue);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} role="combobox" aria-expanded={isOpen} className="w-[200px] justify-between">
          {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select category"}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog
            type={type}
            successCallback={successCallback}
            trigger={
              <Button variant="outline" size="sm" className="mx-auto mt-2">
                Create "{type}" category
              </Button>
            }
          />

          <CommandEmpty>
            <div className="flex flex-col gap-2 p-2 text-center">
              <p>No categories found</p>
            </div>
          </CommandEmpty>

          <CommandGroup heading="Categories">
            <CommandList>
              {categoriesQuery.data?.map((category: Category) => (
                <CommandItem
                  key={category.name}
                  value={category.name.toLowerCase()}
                  onSelect={() => {
                    setIsValue(category.name);
                    setIsOpen(false);
                  }}
                >
                  <CategoryRow category={category} />
                  <Check className={cn("ml-auto h-4 w-4", isValue === category.name ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
