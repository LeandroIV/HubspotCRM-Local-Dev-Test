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

hubspot.extend(({ context, actions }) => (
  <IparaCard context={context} actions={actions} />
));

const IparaCard = ({ context }) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContact = async () => {
    setLoading(true);
    setError(null);
    try {
      const objectId = context.crm.objectId;
      const response = await hubspot.fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${objectId}?properties=firstname,lastname,email`
      );
      const data = await response.json();
      setContact(data.properties);
    } catch (e) {
      setError("Failed to load contact data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading contact..." />;

  return (
    <>
      <Heading>iPara CRM Card</Heading>
      <Divider />
      {error && <Alert title="Error" variant="error">{error}</Alert>}
      {contact && (
        <>
          <Text>Name: {contact.firstname} {contact.lastname}</Text>
          <Text>Email: {contact.email}</Text>
        </>
      )}
      <Button onClick={fetchContact} variant="primary">
        Load Contact Info
      </Button>
    </>
  );
};
