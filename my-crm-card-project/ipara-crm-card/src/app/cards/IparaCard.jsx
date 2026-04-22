import {
  hubspot,
  Text,
  Heading,
  Divider,
  Tile,
} from "@hubspot/ui-extensions";

hubspot.extend(({ context }) => <IparaCard context={context} />);

const IparaCard = ({ context }) => {
  const objectId = context.crm?.objectId;
  const portalId = context.portal?.id;
  const userId = context.user?.id;

  return (
    <>
      <Heading>iPara CRM Card</Heading>
      <Divider />
      <Tile>
        <Text format={{ fontWeight: "bold" }}>Contact Object ID</Text>
        <Text>{objectId ?? "N/A"}</Text>
      </Tile>
      <Tile>
        <Text format={{ fontWeight: "bold" }}>Portal ID</Text>
        <Text>{portalId ?? "N/A"}</Text>
      </Tile>
      <Tile>
        <Text format={{ fontWeight: "bold" }}>User ID</Text>
        <Text>{userId ?? "N/A"}</Text>
      </Tile>
    </>
  );
};
