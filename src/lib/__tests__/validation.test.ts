import {
  signUpSchema,
  loginSchema,
  createPostSchema,
  updateUserProfileSchema,
  createCommentSchema,
} from '../validation';

describe('validation schemas', () => {
  describe('signUpSchema', () => {
    it('should validate correct sign up data', () => {
      const validData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      expect(() => signUpSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
      };
      expect(() => signUpSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        username: 'testuser',
        password: 'password123',
      };
      expect(() => signUpSchema.parse(invalidData)).toThrow();
    });

    it('should reject username with invalid characters', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'test user!',
        password: 'password123',
      };
      expect(() => signUpSchema.parse(invalidData)).toThrow();
    });

    it('should accept username with allowed special characters', () => {
      const validData = {
        email: 'test@example.com',
        username: 'test_user-123',
        password: 'password123',
      };
      expect(() => signUpSchema.parse(validData)).not.toThrow();
    });

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'short',
      };
      expect(() => signUpSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: '',
      };
      expect(() => signUpSchema.parse(invalidData)).toThrow();
    });

    it('should trim whitespace from fields', () => {
      const data = {
        email: '  test@example.com  ',
        username: '  testuser  ',
        password: '  password123  ',
      };
      const result = signUpSchema.parse(data);
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.password).toBe('password123');
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password123',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should trim whitespace from fields', () => {
      const data = {
        username: '  testuser  ',
        password: '  password123  ',
      };
      const result = loginSchema.parse(data);
      expect(result.username).toBe('testuser');
      expect(result.password).toBe('password123');
    });
  });

  describe('createPostSchema', () => {
    it('should validate correct post data', () => {
      const validData = {
        content: 'This is a post',
        mediaIds: [],
      };
      expect(() => createPostSchema.parse(validData)).not.toThrow();
    });

    it('should validate post with media', () => {
      const validData = {
        content: 'This is a post',
        mediaIds: ['media1', 'media2'],
      };
      expect(() => createPostSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty content', () => {
      const invalidData = {
        content: '',
        mediaIds: [],
      };
      expect(() => createPostSchema.parse(invalidData)).toThrow();
    });

    it('should reject more than 5 media attachments', () => {
      const invalidData = {
        content: 'This is a post',
        mediaIds: ['1', '2', '3', '4', '5', '6'],
      };
      expect(() => createPostSchema.parse(invalidData)).toThrow();
    });

    it('should accept exactly 5 media attachments', () => {
      const validData = {
        content: 'This is a post',
        mediaIds: ['1', '2', '3', '4', '5'],
      };
      expect(() => createPostSchema.parse(validData)).not.toThrow();
    });

    it('should trim whitespace from content', () => {
      const data = {
        content: '  This is a post  ',
        mediaIds: [],
      };
      const result = createPostSchema.parse(data);
      expect(result.content).toBe('This is a post');
    });
  });

  describe('updateUserProfileSchema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        username: 'testuser',
        displayName: 'Test User',
        bio: 'This is a bio',
      };
      expect(() => updateUserProfileSchema.parse(validData)).not.toThrow();
    });

    it('should reject username with invalid characters', () => {
      const invalidData = {
        username: 'test user!',
        displayName: 'Test User',
        bio: 'This is a bio',
      };
      expect(() => updateUserProfileSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        displayName: 'Test User',
        bio: 'This is a bio',
      };
      expect(() => updateUserProfileSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty displayName', () => {
      const invalidData = {
        username: 'testuser',
        displayName: '',
        bio: 'This is a bio',
      };
      expect(() => updateUserProfileSchema.parse(invalidData)).toThrow();
    });

    it('should reject bio longer than 1000 characters', () => {
      const invalidData = {
        username: 'testuser',
        displayName: 'Test User',
        bio: 'a'.repeat(1001),
      };
      expect(() => updateUserProfileSchema.parse(invalidData)).toThrow();
    });

    it('should accept bio with exactly 1000 characters', () => {
      const validData = {
        username: 'testuser',
        displayName: 'Test User',
        bio: 'a'.repeat(1000),
      };
      expect(() => updateUserProfileSchema.parse(validData)).not.toThrow();
    });

    it('should accept empty bio', () => {
      const validData = {
        username: 'testuser',
        displayName: 'Test User',
        bio: '',
      };
      expect(() => updateUserProfileSchema.parse(validData)).not.toThrow();
    });
  });

  describe('createCommentSchema', () => {
    it('should validate correct comment data', () => {
      const validData = {
        content: 'This is a comment',
      };
      expect(() => createCommentSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty content', () => {
      const invalidData = {
        content: '',
      };
      expect(() => createCommentSchema.parse(invalidData)).toThrow();
    });

    it('should trim whitespace from content', () => {
      const data = {
        content: '  This is a comment  ',
      };
      const result = createCommentSchema.parse(data);
      expect(result.content).toBe('This is a comment');
    });
  });
});

