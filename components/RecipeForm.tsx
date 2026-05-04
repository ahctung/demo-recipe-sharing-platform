"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
};

export function RecipeForm({ action }: Props) {
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, ""]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function addInstruction() {
    setInstructions((prev) => [...prev, ""]);
  }

  function removeInstruction(index: number) {
    setInstructions((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">New recipe</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Fields match <span className="font-medium text-foreground">public.recipes</span>{" "}
          (title, description, times, difficulty, category, ingredients, instructions).
        </p>
      </div>

      <div className="space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15">
        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Title <span className="text-red-600">*</span>
          </span>
          <input
            name="title"
            type="text"
            required
            placeholder="e.g. Weeknight lentil soup"
            className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Description
          </span>
          <textarea
            name="description"
            rows={3}
            placeholder="Short intro for the recipe card"
            className="mt-2 w-full rounded-md border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Category <span className="text-red-600">*</span>
            </span>
            <input
              name="category"
              type="text"
              required
              placeholder="e.g. Dinner, Dessert"
              className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Cook time (minutes)
            </span>
            <input
              name="cook_time_minutes"
              type="number"
              min={0}
              step={1}
              placeholder="Optional"
              className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Difficulty
          </span>
          <select
            name="difficulty"
            className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
            defaultValue=""
          >
            <option value="">Not set</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-xs font-medium text-black/70 dark:text-white/70">
            Ingredients <span className="text-red-600">*</span>
          </legend>
          <p className="text-xs text-black/55 dark:text-white/55">
            One line per ingredient (e.g. &quot;2 cups vegetable stock&quot;).
          </p>
          <ul className="space-y-2">
            {ingredients.map((value, index) => (
              <li key={index} className="flex gap-2">
                <input
                  name="ingredient"
                  value={value}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="min-w-0 flex-1 rounded-md border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length <= 1}
                  className="shrink-0 rounded-md border border-black/15 px-3 text-sm font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            + Add ingredient
          </button>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-xs font-medium text-black/70 dark:text-white/70">
            Instructions <span className="text-red-600">*</span>
          </legend>
          <p className="text-xs text-black/55 dark:text-white/55">
            One step per line, in order.
          </p>
          <ul className="space-y-2">
            {instructions.map((value, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-2 w-6 shrink-0 text-right text-xs font-medium text-black/50 dark:text-white/50">
                  {index + 1}.
                </span>
                <textarea
                  name="instruction"
                  value={value}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  rows={2}
                  placeholder={`Step ${index + 1}`}
                  className="min-w-0 flex-1 rounded-md border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length <= 1}
                  className="mt-0.5 h-9 shrink-0 self-start rounded-md border border-black/15 px-3 text-sm font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addInstruction}
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            + Add step
          </button>
        </fieldset>

        <div className="flex flex-wrap gap-3 border-t border-black/10 pt-5 dark:border-white/15">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
          >
            Save recipe
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
