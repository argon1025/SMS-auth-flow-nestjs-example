import { Module } from '@nestjs/common';

import { CookieService } from 'library/cookie/cookie.service';

@Module({ providers: [CookieService], exports: [CookieService] })
export class CookieModule {}
