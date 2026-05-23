

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên người dùng không được bỏ trống"),
  lastname: z.string().min(1, "Họ người dùng không được bỏ trống"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
type SignUpFormValues = z.infer<typeof signUpSchema>;
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema)
  });
  const onSubmit = async (data: SignUpFormValues) => {
    // Gọi backend để signup
  }
  return (
    <div
      className={cn("mx-auto flex w-full max-w-4xl flex-col gap-4", className)}
      {...props}
    >
      <Card className="p-0 overflow-hidden shadow-soft">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form bên trái */}
          <form className="p-5 md:p-7" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {/* Header - logo */}
              <div className="flex flex-col items-center gap-2 text-center">
                <a href="/" className="block mb-2 w-fit">
                  <img
                    src="/logo.svg"
                    alt="logo"
                    className="w-auto h-12 mx-auto drop-shadow-sm"
                  />
                </a>

                <h1 className="text-2xl font-bold">Tạo tài khoản Chat</h1>

                <p className="text-sm text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu!
                </p>
              </div>

              {/* Họ & tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Họ
                  </Label>
                  <Input type="text" id="lastname"  {...register("lastname")}/>
                 {errors.lastname && (
                    <p className="text-sm text-destructive">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    Tên
                  </Label>
                  <Input type="text" id="firstname" {...register("firstname")} />
                  {errors.firstname && (
                    <p className="text-sm text-destructive">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input type="text" id="username" placeholder="username" {...register("username")} />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input type="email" id="email" placeholder="username@gmail.com" {...register("email")} />
                 {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input type="password" id="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Nút đăng ký */}
              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                Tạo tài khoản
              </Button>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-border" />
                <span className="px-3 text-xs text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Google login */}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-3 bg-background hover:bg-secondary"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
                  />
                </svg>

                Tiếp tục bằng Google
              </Button>

              <div className="text-sm text-center">
                Đã có tài khoản?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>

          {/* Hình bên phải */}
          <div className="relative hidden p-8 bg-muted md:flex md:items-center md:justify-center">
            <img
              src="/placeholder.svg"
              alt="Signup illustration"
              className="w-full max-w-[310px] object-contain drop-shadow-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="px-6 text-center text-xs text-muted-foreground text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}