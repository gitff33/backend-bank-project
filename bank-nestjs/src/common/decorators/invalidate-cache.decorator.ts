import { SetMetadata } from "@nestjs/common";

export const INVALIDATE_CACHE_KEY = 'INVALIDATE_CACHE_KEY';



export const InvalidateCache = (...routes:string[])=>
    SetMetadata(INVALIDATE_CACHE_KEY,routes)