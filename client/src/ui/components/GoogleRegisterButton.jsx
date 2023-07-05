import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const config = {
  clientId: '985696747479-h8l7tqvvvtf7ke939nghvkbogkkjjev6.apps.googleusercontent.com',
  onSuccess: (response) => {
    // Handle successful login response
    console.log(response);
  },
  onFailure: (error) => {
    // Handle failed login response
    console.error(error);
  },
  scope: 'email',
};




exportconst App = () => {
  return (
    <GoogleOAuthProvider config={config}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

const LoginForm = () => {
  const { signIn } = useGoogleLogin();

  const handleGoogleLogin = () => {
    signIn();
  };

  return (
    <form>
      {/* Other form fields */}
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </form>
  );
};
