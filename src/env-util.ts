export const requireEnv = (key: string, secret = false) => {
  const value = Deno.env.get(key)?.trim() ?? ``;

  if (value.length == 0) {
    console.error(`${key} env variable is required`);
    Deno.exit(1);
  }

  console.log(`${key}: "${secret ? `*`.repeat(value.length) : value}"`);

  return value;
};
