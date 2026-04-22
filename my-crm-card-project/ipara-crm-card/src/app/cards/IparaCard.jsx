import { useState } from "react";
import {
  hubspot,
  Text,
  Button,
  Heading,
  Divider,
  LoadingSpinner,
  Alert,
} from "@hubspot/ui-extensions";

hubspot.extend(({ context, runServerlessFunction }) => (
  <IparaCard runServerless={runServerlessFunction} context={context} />
));

const IparaCard = ({ runServerless, context }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runServerless({
        name: "main",
        parameters: { objectId: context.crm.objectId },
      });
      setMessage(result.response.message);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading..." />;

  return (
    <>
      <Heading>iPara CRM Card</Heading>
      <Divider />
      {error && <Alert title="Error" variant="error">{error}</Alert>}
      {message && <Text>{message}</Text>}
      <Button onClick={fetchData} variant="primary">
        Run Function
      </Button>
    </>
  );
};
