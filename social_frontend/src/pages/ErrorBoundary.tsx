import Button from "../components/Button";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

const ErrorBoundary = () => {
  const navigate = useNavigate();

  let error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full h-screen flex justify-center flex-col items-center p-4">
        <div className="border-2 p-4 rounded-box flex gap-2 flex-col">
          <h1 className="text-xl">
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
          <Button
            content="&larr;Back"
            className="btn btn-outline w-20 h-10"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};

export default ErrorBoundary;
