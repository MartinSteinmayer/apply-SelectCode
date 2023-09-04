//Copied from https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/

import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user)
  }
  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void
  ): any {
    done(null, payload)
  }
}