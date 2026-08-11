import originalHtml from "../content/original.html?raw";

function extract(source: string, pattern: RegExp, label: string) {
  const match = source.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Unable to extract ${label} from the original website.`);
  }
  return match[1];
}

const originalStyles = extract(
  originalHtml,
  /<style>([\s\S]*?)<\/style>/i,
  "styles",
);

const originalBody = extract(
  originalHtml,
  /<body[^>]*>([\s\S]*?)<script>/i,
  "page content",
);

const originalScript = extract(
  originalHtml,
  /<script>([\s\S]*?)<\/script>/i,
  "interactions",
);

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: originalStyles }} />
      <div dangerouslySetInnerHTML={{ __html: originalBody }} />
      <script dangerouslySetInnerHTML={{ __html: originalScript }} />
    </>
  );
}
