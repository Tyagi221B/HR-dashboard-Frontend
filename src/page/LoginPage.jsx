import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="wrapper">
        <AuthForm
          title="Welcome to Dashboard"
          fields={[
            { label: "Email Address", type: "email", name: "email", placeholder: "Email Address", required: true },
            { label: "Password", type: "password", name: "password", placeholder: "Password", required: true },
          ]}
          buttonText="Login"
          linkText="Don't have an account?"
          linkUrl="/register"
          forgotPassword={true}
          onSubmitAction="login"
        />
      </div>
    </div>
  );
};

export default LoginPage;
