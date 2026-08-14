import {Test,TestingModule} from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { UserService } from './user.service'
import { PrismaService } from '../prisma/prisma.service'

describe('UserService',()=>{
    let service:UserService;

    const mockPrismaService={
        $transaction:jest.fn((cb)=>
        cb({
            user:{
                // Имитация что такой юзер с таким Email создан.
                findUnique:jest.fn().mockResolvedValue({id:'1',email:'tester@gmail.com'})
            },
        }),
        ),
    };

    beforeEach(async()=>{
        const module:TestingModule = await Test.createTestingModule({
            providers:[
                UserService,
                {
                    provide:PrismaService,
                    useValue:mockPrismaService,
                },
            ],
        }).compile()
            service = module.get<UserService>(UserService);
    });

        it('должен выбросить ConflictException, если Email уже занят.',async()=>{
            const dto={
                email:'tester@gmail.com',
                password:'23123',
                FirstName:'Никита',
                LastName:'Лобов'
            };

            await expect(service.create(dto)).rejects.toThrow(ConflictException)
        });
    });