/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: {
      user: any;
      profile: import('./types/database').Profile;
    };
  }
}
