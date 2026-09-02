"use client";

import { useState, type ReactNode } from "react";

type ArticleLanguagesProps = {
  en: ReactNode;
  id: ReactNode;
};

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
] as const;

export default function ArticleLanguages({ en, id }: ArticleLanguagesProps) {
  const [lang, setLang] = useState<"en" | "id">("en");

  return (
    <div>
      <div
        className="mb-8 inline-flex overflow-hidden rounded border border-line font-mono text-xs"
        role="group"
        aria-label="Article language"
      >
        {LANGUAGES.map(({ code, label }) => {
          const active = lang === code;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={active}
              onClick={() => setLang(code)}
              className={`min-h-9 px-3 tracking-widest uppercase transition-colors ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-faint hover:text-paper"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="prose-dossier">{lang === "en" ? en : id}</div>
    </div>
  );
}
