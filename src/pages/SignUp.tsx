import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

const SignUp = () => {
  return (
    <div className="container mx-auto flex justify-center py-12">
      <div className="w-full max-w-md">
        <ClerkSignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUp; 