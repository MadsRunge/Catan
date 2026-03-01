# Lessons Learned

## Build Scripts
### PNPM v10 ignores build scripts by default
In PNPM v10, build scripts (postinstall, etc.) are ignored by default. If a dependency like Electron needs to run a build script to download binaries, it will fail unless approved.
To fix this, add the following to `package.json`:
```json
  "pnpm": {
    "onlyBuiltDependencies": [
      "electron",
      "electron-winstaller",
      "esbuild"
    ]
  }
```
Then run `pnpm rebuild`.
