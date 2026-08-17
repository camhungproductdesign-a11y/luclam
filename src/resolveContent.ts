import { translations, type Language } from './translations';

/**
 * The editor's overrides, as stored in public/config.json.
 * Keyed by language, then shaped like that language's translation block.
 */
export type Overrides = Partial<Record<Language, any>>;

/**
 * Merges a source over a target without discarding what the source omits.
 *
 * Arrays merge element by element rather than replacing wholesale, so an
 * override that names only the third tea's price leaves the other five intact.
 *
 * This lived inside App.tsx, which meant the generated pages could not reach
 * it: scripts/prerender read translations.ts directly and never saw an
 * override. An edit therefore showed up for readers, who run the app, and
 * never for crawlers, who read the HTML — including the Product prices in the
 * JSON-LD. One function, used by both, is what keeps those two in step.
 */
export function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
      const targetArr = [...target[key]];
      const sourceArr = source[key];
      for (let i = 0; i < sourceArr.length; i++) {
        // An index the override says nothing about must leave the original
        // alone. It arrives in two shapes and both used to destroy content,
        // because neither is an Object and the else branch below copied it
        // straight over the real entry.
        //
        // A hole, while the override is still an array in memory: the editor
        // assigned to menuItems[1] of an empty array, leaving index 0 unset.
        //
        // A null, once that array has been through config.json: JSON has no
        // hole, so JSON.stringify writes one out as null and it comes back as a
        // real value sitting in a real slot. That is why fixing only the hole
        // was not enough — the corruption survived the save and reappeared on
        // the next load, this time taking the build down with it.
        if (!(i in sourceArr) || sourceArr[i] === null || sourceArr[i] === undefined) continue;

        if (sourceArr[i] instanceof Object && targetArr[i]) {
          targetArr[i] = deepMerge(targetArr[i], sourceArr[i]);
        } else {
          targetArr[i] = sourceArr[i];
        }
      }
      output[key] = targetArr;
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

/**
 * The content one language actually shows, after English fills any gap and the
 * editor's overrides are laid on top. English is the base because it is the
 * only block guaranteed complete; a language missing a key inherits it rather
 * than rendering undefined.
 */
export function resolveContent(lang: Language, overrides: Overrides = {}): any {
  return deepMerge(
    deepMerge(translations.en, translations[lang] || {}),
    overrides[lang] || {}
  );
}

/** Every language resolved once, for the generator, which renders all of them. */
export type ResolvedContent = Record<Language, any>;

export function resolveAllLanguages(overrides: Overrides = {}): ResolvedContent {
  const out = {} as ResolvedContent;
  for (const lang of Object.keys(translations) as Language[]) {
    out[lang] = resolveContent(lang, overrides);
  }
  return out;
}
