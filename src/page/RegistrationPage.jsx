import AuthForm from "../components/AuthForm";

const RegisterPage = () => {
  return (
    <div className="container">
      <div className="wrapper">

        {/* Left Section */}
        <leftSectionAuth />

        {/* Right Section  */}

        <AuthForm
          title="Create an Account"
          fields={[
            { label: "Full Name", type: "text", name: "fullName", placeholder: "Full name", required: true },
            { label: "Email Address", type: "email", name: "email", placeholder: "Email Address", required: true },
            { label: "Password", type: "password", name: "password", placeholder: "Password", required: true },
            { label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "Confirm Password", required: true },
          ]}
          buttonText="Register"
          linkText="Already have an account?"
          linkUrl="/login"
        />
        
      </div>
    </div>
  );
};

export default RegisterPage;
