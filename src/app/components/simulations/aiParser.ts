export function parsePromptToJSON(prompt: string) {
  const text = prompt.toLowerCase();

  const objects: any[] = [];

  // Detect multiple objects
  if (text.includes("car")) {
    objects.push(extractProperties(text, "car"));
  }

  if (text.includes("tree")) {
    objects.push(extractProperties(text, "tree"));
  }

  if (text.includes("house")) {
    objects.push(extractProperties(text, "house"));
  }

  if (text.includes("robot")) {
    objects.push(extractProperties(text, "robot"));
  }

  if (objects.length === 0) {
    objects.push({ type: "abstract" });
  }

  return { objects };
}

/* -------- PROPERTY EXTRACTOR -------- */

function extractProperties(text: string, type: string) {
  const obj: any = {
    type,
    color: "blue",
    size: "medium",
    wheels: 4
  };

  // COLOR
  if (text.includes("red")) obj.color = "red";
  if (text.includes("green")) obj.color = "green";
  if (text.includes("blue")) obj.color = "blue";
  if (text.includes("yellow")) obj.color = "yellow";

  // SIZE
  if (text.includes("big") || text.includes("large")) obj.size = "large";
  if (text.includes("small")) obj.size = "small";

  // WHEELS
  const match = text.match(/(\d+)\s*wheels?/);
  if (match) obj.wheels = parseInt(match[1]);

  return obj;
}