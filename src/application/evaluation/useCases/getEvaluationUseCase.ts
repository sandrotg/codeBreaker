import { EvaluationRepository } from 'src/domain/evaluations/repositories/evaluation.repository';

export class GetEvaluationUseCase {
    constructor(
        private readonly evaluationRepo: EvaluationRepository
    ){ }

    async execute(id: string) {

        const evaluation = await this.evaluationRepo.findEvaluationById(id);
        if (!evaluation) throw new Error("Not found");
        
        const nowUTC = new Date();
        const offsetMinutes = 5 * 60;
        const now = new Date(nowUTC.getTime() - offsetMinutes * 60 * 1000)
        const start = new Date(evaluation.startAt);
        const expiresAt = new Date(start.getTime() + evaluation.duration * 60 * 1000);
        let startsIn: number | undefined;


        let state: "no_disponible" | "activo" | "no_activo";

        if (now < start) {
            state = "no_disponible";
        } else if (now >= start && now <= expiresAt) {
            state = "activo";
        } else {
            state = "no_activo";
        }

        if (state === "no_disponible") {
            startsIn = (start.getTime() - now.getTime()) / (1000 * 60);
        }

        return {
            evaluationId: evaluation.evaluationId,
            name: evaluation.name,
            startAt: evaluation.startAt,
            durationMinutes: evaluation.duration,
            state,
            expiresAt,
            startsIn
        };

    }
}

