import { SignUp } from "@clerk/nextjs";

export default function SignUpUser() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SignUp />
    </div>
  );
}
