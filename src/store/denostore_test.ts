import { assert, assertObjectMatch, assertExists } from "@std/assert"
import { DenoStore } from "./denostore.ts"

Deno.test({
  name: "Test Memory Deno KVStore",
  sanitizeResources: false,
  async fn(t) {
    const store = new DenoStore(await Deno.openKv(`:memory:`))

    await t.step(`Save object`, async () => {
      const ok = await store.save<object>([`some`, `key`], {some: `key`})
      assert(ok)
    })

    await t.step(`Read object`, async () => {
      const value = await store.load<object>([`some`, `key`])
      assertExists(value)
      assertObjectMatch(value, {some: `key`})
    })

    store.close()
  },
});
