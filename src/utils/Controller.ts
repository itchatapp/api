export { Controller, GenerateBaseGuard, GenerateGuard } from 'https://deno.land/x/itchat_controllers@v1.0.0/mod.ts';
import { Context as DefaultContext } from 'https://deno.land/x/itchat_controllers@v1.0.0/mod.ts';
import type { User } from '@structures';

Object.defineProperty(DefaultContext, 'user', {
    get() {
        return this.request.user
    }
})

export interface Context extends DefaultContext {
  user: User;
}