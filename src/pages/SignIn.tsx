import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="container mx-auto flex justify-center py-12">
      <div className="w-full max-w-md">
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          redirectUrl="/"
        />
      </div>
    </div>
  );
};

export default SignIn; 