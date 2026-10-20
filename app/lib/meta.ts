import {translate, type Language, type MessageKey} from '~/lib/i18n';

type Matches = ReadonlyArray<{loaderData?: unknown} | undefined>;

/** Page title in the visitor's language, using the root loader's locale. */
export function titleFor(matches: Matches, key: MessageKey | string, isKey = true) {
  const root = matches[0]?.loaderData as {locale?: {language: Language}} | undefined;
  const language = root?.locale?.language ?? 'en';
  const title = isKey ? translate(language, key as MessageKey) : key;
  return [{title: `${title} | Afnan`}];
}
