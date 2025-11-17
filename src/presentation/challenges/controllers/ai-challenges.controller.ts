import { Body, Controller, Post } from "@nestjs/common";
import { GenerateChallengeUseCase } from "../../../modules/ai-challenges/application/use-cases/generate-challenge.use-case";
import { GenerateChallengeDto } from "../../../modules/ai-challenges/presentation/dtos/generate-challenge.dto";
import { ChallengeResponse } from "../../../modules/ai-challenges/presentation/dtos/response.dto";

@Controller('ai-challenges')
export class AIChallengesController {
    constructor(private readonly generateChallengeUseCase: GenerateChallengeUseCase) {}
    
    @Post('generate')
    async generateChallenges(
        @Body() body: GenerateChallengeDto
    ): Promise<ChallengeResponse>{
        return this.generateChallengeUseCase.execute(body.theme)
    }
}
