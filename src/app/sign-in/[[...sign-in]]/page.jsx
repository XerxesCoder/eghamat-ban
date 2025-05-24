import { SignIn } from "@clerk/nextjs";

export default function SignInUser() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white"

    >
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#00E5FF", // Your aqua color
            colorText: "#0A2463", // Your deep ocean text
            fontFamily: "Vazir, sans-serif",
          },
          elements: {
            formButtonPrimary: "bg-aqua-spark hover:bg-aqua-spark/90",
            footerActionLink: "text-deep-ocean hover:text-aqua-spark",
          },
        }}
      />
    </div>
  );
}
