import { SigninForm } from "@/components/auth/signin-form"

const SignInPage = () => {
    return (
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 min-h-svh bg-muted md:p-10 bg-gradient-glass">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SigninForm />
        </div>
      </div>
    )
}

export default SignInPage
