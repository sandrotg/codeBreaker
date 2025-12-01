import { Body, Controller, Post } from "@nestjs/common";
import { GenerateChallengeUseCase } from "../../../application/challenges/useCases/challenges/generate-challenge.use-case";
import { GenerateChallengeDto } from "../dtos/generate-challenge.dto";
import { ChallengeResponse } from "../dtos/response.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth('bearer')
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
