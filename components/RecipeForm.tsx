"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";

export type RecipeFormInitialValues = {
  title: string;
  description: string | null;
  category: string;
  cook_time_minutes: number | null;
  difficulty: string | null;
  ingredients: string[];
  instructions: string[];
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  mode?: "create" | "edit" | "display";
  initialValues?: RecipeFormInitialValues;
};

function nonEmptyLines(lines: string[] | undefined, fallback: string[]) {
  if (!lines?.length) {
    return fallback;
  }
  const copy = lines.map((s) => s.trim()).filter(Boolean);
  return copy.length > 0 ? copy : fallback;
}

function formatDifficultyLabel(value: string | null): string {
  if (!value) {
    return "—";
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatCookTimeLabel(minutes: number | null): string {
  if (minutes === null || minutes === undefined) {
    return "Not set";
  }
  if (minutes === 0) {
    return "0 min";
  }
  if (minutes === 1) {
    return "1 min";
  }
  return `${minutes} min`;
}

function readOnlyBox(children: ReactNode) {
  return (
    <div className="mt-2 rounded-md border border-black/10 bg-black/[0.02] px-3 py-2.5 text-sm text-foreground dark:border-white/15 dark:bg-white/[0.04]">
      {children}
    </div>
  );
}

export function RecipeForm({
  action,
  mode = "create",
  initialValues,
}: Props) {
  const isDisplayMode = mode === "display";
  const [isEditing, setIsEditing] = useState(() => !isDisplayMode);
  const [editFormKey, setEditFormKey] = useState(0);

  const [ingredients, setIngredients] = useState<string[]>(() =>
    nonEmptyLines(initialValues?.ingredients, [""]),
  );
  const [instructions, setInstructions] = useState<string[]>(() =>
    nonEmptyLines(initialValues?.instructions, [""]),
  );

  const resetListsFromInitial = useCallback(() => {
    setIngredients(nonEmptyLines(initialValues?.ingredients, [""]));
    setInstructions(nonEmptyLines(initialValues?.instructions, [""]));
  }, [initialValues?.ingredients, initialValues?.instructions]);

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

  const diffDefault = initialValues?.difficulty ?? "";
  const cookDefault =
    initialValues?.cook_time_minutes != null
      ? String(initialValues.cook_time_minutes)
      : "";

  function enterEditMode() {
    resetListsFromInitial();
    setEditFormKey((k) => k + 1);
    setIsEditing(true);
  }

  function leaveEditMode() {
    resetListsFromInitial();
    setIsEditing(false);
  }

  const showReadOnlyShell = isDisplayMode && !isEditing;

  const headingTitle = showReadOnlyShell
    ? "Display recipe"
    : mode === "create"
      ? "New recipe"
      : "Edit recipe";

  const headingSubtitle = showReadOnlyShell
    ? "View recipe details. Use Edit recipe to make changes."
    : mode === "create"
      ? "Fields match public.recipes (title, description, cook time, difficulty, category, ingredients, instructions)."
      : "Update this recipe and save your changes.";

  if (!initialValues && (mode === "display" || mode === "edit")) {
    return (
      <p className="text-sm text-red-700 dark:text-red-200">
        Missing recipe data for this form.
      </p>
    );
  }

  const v = initialValues;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{headingTitle}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {headingSubtitle}
        </p>
      </div>

      {showReadOnlyShell && v ? (
        <div className="space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15">
          <div>
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Title
            </span>
            {readOnlyBox(v.title)}
          </div>

          <div>
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Description
            </span>
            {readOnlyBox(
              v.description?.trim() ? (
                <p className="whitespace-pre-wrap">{v.description}</p>
              ) : (
                <span className="text-black/50 dark:text-white/50">—</span>
              ),
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium text-black/70 dark:text-white/70">
                Category
              </span>
              {readOnlyBox(v.category)}
            </div>
            <div>
              <span className="text-xs font-medium text-black/70 dark:text-white/70">
                Cook time
              </span>
              {readOnlyBox(formatCookTimeLabel(v.cook_time_minutes))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Difficulty
            </span>
            {readOnlyBox(formatDifficultyLabel(v.difficulty))}
          </div>

          <div>
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Ingredients
            </span>
            {readOnlyBox(
              <ul className="list-inside list-disc space-y-1">
                {v.ingredients.filter(Boolean).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>,
            )}
          </div>

          <div>
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Instructions
            </span>
            {readOnlyBox(
              <ol className="list-inside list-decimal space-y-2">
                {v.instructions.filter(Boolean).map((line, i) => (
                  <li key={i} className="whitespace-pre-wrap pl-1">
                    {line}
                  </li>
                ))}
              </ol>,
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-black/10 pt-5 dark:border-white/15">
            <button
              type="button"
              onClick={enterEditMode}
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
            >
              Edit recipe
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form
          key={editFormKey}
          action={action}
          className="space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15"
        >
          <label className="block">
            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              Title <span className="text-red-600">*</span>
            </span>
            <input
              name="title"
              type="text"
              required
              defaultValue={v?.title}
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
              defaultValue={v?.description ?? ""}
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
                defaultValue={v?.category}
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
                defaultValue={cookDefault}
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
              defaultValue={diffDefault}
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
              {mode === "create" ? "Save recipe" : "Save changes"}
            </button>
            {isDisplayMode ? (
              <button
                type="button"
                onClick={leaveEditMode}
                className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Cancel
              </Link>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
