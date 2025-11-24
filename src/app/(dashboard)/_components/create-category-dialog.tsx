"use client";

import { Circle, CircleOff, Loader2, PlusSquare } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import createCategoryAction from "../_actions/create-category-action";
import { Category } from "@/generated/prisma/client";
import { useTheme } from "next-themes";
import { TransactionType } from "@/lib/types";
interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger: ReactNode;
}

export const CreateCategoryDialog = ({ type, successCallback, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema) as Resolver<CreateCategorySchemaType>,
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();

  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: createCategoryAction,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories", type],
      });

      setIsOpen((prev) => !prev);
    },

    onError() {
      toast.error("Something went wrong!", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"ghost"} className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground">
            <PlusSquare className="mr-2 h-4 w-4" />
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-red-500")}>{type}</span> category
          </DialogTitle>

          <DialogDescription>Categories are used to group your transaction</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Category" {...field} />
                  <FieldDescription>This is how your category name will appear in the app</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Icon</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="h-[100px] w-full">
                        {form.watch("icon") ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-5xl" role="img">
                              {field.value}
                            </span>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <CircleOff className="h-24 w-24" />
                            <p className="text-xs text-muted-foreground">Click to select</p>
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <Picker
                        theme={theme.resolvedTheme}
                        data={data}
                        onEmojiSelect={(emoji: { native: string }) => {
                          field.onChange(emoji.native);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>This is how your category icon will appear in the app</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={form.handleSubmit(onSubmit)} type="submit" disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
