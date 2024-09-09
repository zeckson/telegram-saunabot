# telegram-saunabot

Sauna Telegram Bot

# Configuration

1. Install [Deno](https://deno.land/) or [DVM](https://github.com/justjavac/dvm)
2. Use version from `.dvmrc`
3. If you use JetBrains IDE, please use this
   [guide](https://deno.land/manual@v1.11.3/getting_started/setup_your_environment#jetbrains-ides)

# Update dependencies

### Write updated dependencies to lock file

```shell
# Create/update the lock file "deno.lock".
deno cache --lock=deno.lock --lock-write src/deps.ts
```

### Update dependencies and cache

```shell
# Download the project's dependencies into the machine's cache, integrity
# checking each resource.
deno cache --reload --lock=deno.lock src/deps.ts
```

# Deploy

Application is deployed on
[Deno Dash](https://dash.deno.com/projects/telegram-saunabot)

# Links

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Deep Linking](https://core.telegram.org/api/links#public-username-links)
- [Lols bot antispam database](https://lols.bot/?a=<id>)
- [Grammy Guide](https://grammy.dev/guide/)
