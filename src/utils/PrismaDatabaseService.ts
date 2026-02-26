import prisma from '@/lib/prisma'

class PrismaDatabaseService {
  constructor() {
    // 移除构造函数中的异步调用
  }

  private async initDatabase() {
    try {
      // 检查是否已有数据
      const count = await prisma.verificationCode.count();

      if (count === 0) {
        // 生成10条4位数字的验证码
        const codes = [];
        for (let i = 0; i < 10; i++) {
          const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 5); // 5 days from now

          codes.push({
            code,
            expiresAt
          });
        }

        // 批量插入数据
        await prisma.verificationCode.createMany({
          data: codes
        });

        console.log('Initialized 10 verification codes with Prisma');
      }
    } catch (error) {
      console.error('Error initializing database with Prisma:', error);
    }
  }

  async generateAndStoreCode(): Promise<string> {
    // 初始化数据库（如果需要）
    await this.initDatabase();

    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5); // 5 days from now

    try {
      const result = await prisma.verificationCode.create({
        data: {
          code,
          expiresAt
        }
      });
      return result.code;
    } catch (error) {
      console.error('Error storing verification code:', error);
      throw error;
    }
  }

  async verifyCode(code: string): Promise<boolean> {
    try {
      const now = new Date();
      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          code,
          expiresAt: {
            gt: now
          }
        }
      });

      if (verificationCode) {
        // 删除已使用的验证码
        await prisma.verificationCode.delete({
          where: {
            id: verificationCode.id
          }
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  async cleanupExpiredCodes() {
    try {
      const now = new Date();
      await prisma.verificationCode.deleteMany({
        where: {
          expiresAt: {
            lte: now
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }
}

export default new PrismaDatabaseService();
