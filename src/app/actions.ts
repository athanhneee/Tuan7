"use server";

import {
  memberSchema,
  type MemberFormValues,
  type RegisterActionState
} from "@/lib/validations/member";

const registeredEmails = new Set(["demo@example.com", "admin@example.com"]);

export async function registerMemberAction(
  payload: MemberFormValues
): Promise<RegisterActionState> {
  const parsed = memberSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: "Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const member = {
    fullName: parsed.data.fullName,
    email: parsed.data.email.toLowerCase()
  };

  if (registeredEmails.has(member.email)) {
    return {
      success: false,
      message: "Email này đã tồn tại trên hệ thống.",
      errors: {
        email: ["Email đã được đăng ký"]
      }
    };
  }

  registeredEmails.add(member.email);

  return {
    success: true,
    message: `Đăng ký thành công cho ${member.fullName}. Dữ liệu đã được validate ở client và server.`,
    member
  };
}
