import { z } from "zod";

export const memberSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .max(60, "Họ tên không được vượt quá 60 ký tự"),
    email: z
      .string()
      .trim()
      .min(1, "Email là bắt buộc")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu cần ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu cần ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu")
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Xác nhận mật khẩu không trùng khớp"
  });

export type MemberFormValues = z.infer<typeof memberSchema>;

export type ServerFieldErrors = Partial<Record<keyof MemberFormValues, string[]>>;

export type RegisterActionState =
  | {
      success: true;
      message: string;
      member: {
        fullName: string;
        email: string;
      };
    }
  | {
      success: false;
      message: string;
      errors?: ServerFieldErrors;
    };
