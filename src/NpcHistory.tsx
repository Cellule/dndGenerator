import { Card, ListGroup } from "react-bootstrap";
import "./styles/NpcHistory.scss";
import { GeneratedNpc } from "./typings";

export function NpcHistory(props: { activeNpcUid: string; npcHistory: GeneratedNpc[]; onLoadNpc: (npc: GeneratedNpc) => void }) {
  return (
    <Card className="npc-history">
      <Card.Header>NPC History</Card.Header>
      <Card.Body>
        <ListGroup>
          {props.npcHistory.map(({ npc, uid }, i) => (
            <ListGroup.Item key={uid} active={uid === props.activeNpcUid} action={true} onClick={() => props.onLoadNpc({ npc, uid })}>
              {npc.description.name} is a {npc.description.age + " "}
              year old {npc.description.gender} {npc.description.race + " "}
              {npc.description.occupation}.
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
