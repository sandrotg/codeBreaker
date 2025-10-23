import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}