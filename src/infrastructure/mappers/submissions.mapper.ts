import { $Enums } from "@prisma/client";
import { StatusSubmission, SubmissionLanguage } from "src/domain/submissions/entities/submission.entity";


export function mapLanguageToPrisma(lang: SubmissionLanguage): $Enums.Language {
  return lang as unknown as $Enums.Language;
}

export function mapLanguageFromPrisma(lang: $Enums.Language): SubmissionLanguage {
    return lang as unknown as SubmissionLanguage;
}

export function mapStatusFromPrisma(status: $Enums.StatusSubmission): StatusSubmission {
    return status as unknown as StatusSubmission;
}

export function mapStatusToPrisma(status: StatusSubmission): $Enums.StatusSubmission {
    return status as unknown as $Enums.StatusSubmission;
}