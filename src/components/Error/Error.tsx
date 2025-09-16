import "./Error.css";

interface ErrorMessageProps {
  message: string;
}

export default function Error({ message }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
}
