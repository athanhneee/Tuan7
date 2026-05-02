"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerMemberAction } from "@/app/actions";
import {
  memberSchema,
  type MemberFormValues,
  type RegisterActionState
} from "@/lib/validations/member";

const defaultValues: MemberFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const fields: Array<{
  id: keyof MemberFormValues;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
}> = [
  {
    id: "fullName",
    label: "Họ tên",
    type: "text",
    placeholder: "Nguyễn Minh Anh",
    autoComplete: "name"
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "minhanh@example.com",
    autoComplete: "email"
  },
  {
    id: "password",
    label: "Mật khẩu",
    type: "password",
    placeholder: "Tối thiểu 8 ký tự",
    autoComplete: "new-password"
  },
  {
    id: "confirmPassword",
    label: "Xác nhận mật khẩu",
    type: "password",
    placeholder: "Nhập lại mật khẩu",
    autoComplete: "new-password"
  }
];

export function MemberRegisterForm() {
  const [serverState, setServerState] = useState<RegisterActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, touchedFields, dirtyFields }
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const completedFields = useMemo(
    () => Object.keys(dirtyFields).filter(Boolean).length,
    [dirtyFields]
  );

  function applyServerErrors(result: RegisterActionState) {
    if (result.success || !result.errors) {
      return;
    }

    for (const [fieldName, messages] of Object.entries(result.errors)) {
      if (messages?.[0]) {
        setError(fieldName as keyof MemberFormValues, {
          type: "server",
          message: messages[0]
        });
      }
    }
  }

  const onSubmit = handleSubmit((values) => {
    setServerState(null);

    startTransition(async () => {
      const result = await registerMemberAction(values);

      applyServerErrors(result);
      setServerState(result);

      if (result.success) {
        reset(defaultValues);
      }
    });
  });

  return (
    <section className="workspace" aria-label="Form đăng ký thành viên">
      <div className="form-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Biểu mẫu thành viên</p>
            <h1>Đăng ký thành viên</h1>
          </div>
          <span className="progress-pill">{completedFields}/4 trường</span>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="field-stack">
            {fields.map((field) => {
              const fieldError = errors[field.id];
              const hasTouched = Boolean(touchedFields[field.id] || dirtyFields[field.id]);

              return (
                <label className="field" key={field.id} htmlFor={field.id}>
                  <span className="field-label">{field.label}</span>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(fieldError)}
                    aria-describedby={`${field.id}-message`}
                    {...register(field.id)}
                  />
                  <span
                    className={fieldError ? "field-message error" : "field-message helper"}
                    id={`${field.id}-message`}
                    aria-live="polite"
                  >
                    {fieldError?.message ??
                      (hasTouched ? "Hợp lệ" : "Nhập và hệ thống sẽ kiểm tra ngay")}
                  </span>
                </label>
              );
            })}
          </div>

          <button className="submit-button" type="submit" disabled={isPending || !isValid}>
            {isPending ? "Đang gửi..." : "Tạo tài khoản"}
          </button>
        </form>

        {serverState ? (
          <div className={serverState.success ? "server-box success" : "server-box error"}>
            <strong>{serverState.success ? "Server xác nhận" : "Server từ chối"}</strong>
            <span>{serverState.message}</span>
          </div>
        ) : null}
      </div>

      <aside className="requirement-panel" aria-label="Các yêu cầu đã triển khai">
        <div>
          <p className="eyebrow">Điều kiện đăng ký</p>
          <h2>Thông tin cần chính xác</h2>
        </div>

        <ul className="check-list">
          <li>
            <span className="check-mark">01</span>
            <div>
              <strong>Họ tên rõ ràng</strong>
              <p>Dùng tên thật hoặc tên thường dùng để đội ngũ hỗ trợ có thể liên hệ đúng người.</p>
            </div>
          </li>
          <li>
            <span className="check-mark">02</span>
            <div>
              <strong>Email hợp lệ</strong>
              <p>Email cần đúng định dạng và chưa tồn tại trong hệ thống đăng ký.</p>
            </div>
          </li>
          <li>
            <span className="check-mark">03</span>
            <div>
              <strong>Mật khẩu an toàn</strong>
              <p>Mật khẩu tối thiểu 8 ký tự, có ít nhất một chữ hoa và một chữ số.</p>
            </div>
          </li>
          <li>
            <span className="check-mark">04</span>
            <div>
              <strong>Xác nhận khớp</strong>
              <p>Nhập lại mật khẩu chính xác để hoàn tất quá trình tạo tài khoản.</p>
            </div>
          </li>
        </ul>
      </aside>
    </section>
  );
}
