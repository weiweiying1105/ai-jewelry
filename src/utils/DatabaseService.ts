import { Pool } from 'pg';

interface VerificationCode {
  id: number;
  code: string;
  createdAt: Date;
  expiresAt: Date;
}

class DatabaseService {
  private pool: Pool | null = null;
  private useMemoryStorage: boolean = false;
  private memoryCodes: VerificationCode[] = [];
  private nextId: number = 1;

  constructor() {
    try {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      this.initDatabase();
    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      this.useMemoryStorage = true;
      console.log('Using memory storage for verification codes');
    }
  }

  private async initDatabase() {
    if (!this.pool) return;

    try {
      const client = await this.pool.connect();
      await this.createVerificationCodeTable(client);
      client.release();
      console.log('Database connected and initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
      this.useMemoryStorage = true;
      this.pool = null;
      console.log('Falling back to memory storage');
    }
  }

  private async createVerificationCodeTable(client: any) {
    const query = `
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 days'
      );
    `;

    try {
      await client.query(query);
      // 初始化10条4位数字的验证码数据
      await this.initializeVerificationCodes(client);
    } catch (error) {
      console.error('Error creating verification_codes table:', error);
      throw error;
    }
  }

  private async initializeVerificationCodes(client: any) {
    // 检查是否已有数据
    const checkQuery = 'SELECT COUNT(*) FROM verification_codes';
    const checkResult = await client.query(checkQuery);
    const count = parseInt(checkResult.rows[0].count);

    if (count === 0) {
      // 生成10条4位数字的验证码
      const codes = [];
      for (let i = 0; i < 10; i++) {
        const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字
        codes.push(code);
      }

      // 批量插入数据
      const insertQuery = `
        INSERT INTO verification_codes (code, expires_at)
        VALUES ${codes.map((code, index) => `($${index + 1}, CURRENT_TIMESTAMP + INTERVAL '5 days')`).join(', ')}
      `;

      await client.query(insertQuery, codes);
      console.log('Initialized 10 verification codes');
    }
  }

  async generateAndStoreCode(): Promise<string> {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days

    if (this.useMemoryStorage || !this.pool) {
      // 使用内存存储
      this.memoryCodes.push({
        id: this.nextId++,
        code,
        createdAt: now,
        expiresAt
      });
      // 清理过期的验证码
      this.cleanupExpiredMemoryCodes();
      return code;
    }

    // 使用数据库存储
    const query = `
      INSERT INTO verification_codes (code, expires_at)
      VALUES ($1, $2)
      RETURNING code;
    `;

    try {
      const result = await this.pool.query(query, [code, expiresAt]);
      return result.rows[0].code;
    } catch (error) {
      console.error('Error storing verification code:', error);
      //  fallback to memory storage
      this.useMemoryStorage = true;
      this.pool = null;
      console.log('Falling back to memory storage');
      return this.generateAndStoreCode();
    }
  }

  async verifyCode(code: string): Promise<boolean> {
    if (this.useMemoryStorage || !this.pool) {
      // 使用内存存储验证
      return this.verifyCodeFromMemory(code);
    }

    // 使用数据库验证（基于创建时间5天内有效）
    const query = `
      SELECT id FROM verification_codes
      WHERE code = $1 AND created_at > CURRENT_TIMESTAMP - INTERVAL '5 days';
    `;

    try {
      const result = await this.pool.query(query, [code]);

      if (result.rows.length > 0) {
        // 删除已使用的验证码
        await this.pool.query('DELETE FROM verification_codes WHERE id = $1', [result.rows[0].id]);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying code:', error);
      //  fallback to memory storage
      this.useMemoryStorage = true;
      this.pool = null;
      console.log('Falling back to memory storage');
      return this.verifyCodeFromMemory(code);
    }
  }

  private verifyCodeFromMemory(code: string): boolean {
    this.cleanupExpiredMemoryCodes();
    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const codeIndex = this.memoryCodes.findIndex(
      c => c.code === code && c.createdAt > cutoff
    );

    if (codeIndex !== -1) {
      // 删除已使用的验证码
      this.memoryCodes.splice(codeIndex, 1);
      return true;
    }

    return false;
  }

  private cleanupExpiredMemoryCodes() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    this.memoryCodes = this.memoryCodes.filter(c => c.createdAt > cutoff);
  }

  async cleanupExpiredCodes() {
    if (this.useMemoryStorage || !this.pool) {
      this.cleanupExpiredMemoryCodes();
      return;
    }

    const query = "DELETE FROM verification_codes WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '5 days'";

    try {
      await this.pool.query(query);
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }
}

export default new DatabaseService();
