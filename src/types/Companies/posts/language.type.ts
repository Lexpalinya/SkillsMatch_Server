import { PostLanguage } from "@prisma/client";

export type TPostLanguageDTU = PostLanguage;

export type TPostLanguageCreateDTU = { pId: string; lId: string };
export type TPostLanguageCreateBodyDTU = { lId: string };

export type TPostLanguageUpdateDTU = Partial<TPostLanguageCreateDTU>;
