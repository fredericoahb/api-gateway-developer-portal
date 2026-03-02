import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  it("should login with valid credentials", async () => {
    const passwordHash = await bcrypt.hash("pass12345", 10);
    const prismaMock = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: "u1",
          email: "x@y.com",
          name: "X",
          role: "ADMIN",
          passwordHash
        })
      }
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue("jwt") } }
      ]
    }).compile();

    const svc = moduleRef.get(AuthService);
    const out = await svc.login("x@y.com", "pass12345");

    expect(out.accessToken).toBe("jwt");
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
  });
});
