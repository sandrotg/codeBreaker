import { Language, StatusSubmission as PrismaStatusSubmission } from "@prisma/client";
import { StatusSubmission, SubmissionLanguage } from "src/domain/submissions/entities/submission.entity";


export function mapLanguageToPrisma(lang: SubmissionLanguage): Language {
  return lang as unknown as Language;
}

export function mapLanguageFromPrisma(lang: Language): SubmissionLanguage {
    return lang as unknown as SubmissionLanguage;
}

export function mapStatusFromPrisma(status: PrismaStatusSubmission): StatusSubmission {
    return status as unknown as StatusSubmission;
}

export function mapStatusToPrisma(status: StatusSubmission): PrismaStatusSubmission {
    return status as unknown as PrismaStatusSubmission;
}