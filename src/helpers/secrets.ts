/** Get a secret from the context or an environment variable */

export const getSecret = (key: string) => {
  const SECRETS_CONTEXT = process.env.SECRETS_CONTEXT || '{}'
  const allSecrets: Record<string, string> = JSON.parse(SECRETS_CONTEXT)
  if (allSecrets[key]) {
    return allSecrets[key]
  }
  return process.env[key]
}
