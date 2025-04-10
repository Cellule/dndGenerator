import jsoncrush from "jsoncrush";
import { debugNodeToString, generate, Npc, NpcGenerateOptions } from "npc-generator";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";
import Footer from "./Footer";
import NpcData from "./NpcData";
import { NpcHistory } from "./NpcHistory";
import { GeneratedNpc } from "./typings";
import { useNpcHistory } from "./useNpcHistory";
import UserInput from "./UserInput";

export default function DisplayNpc() {
  const [_npcUid, setNpc] = React.useState(useNpcFromQuery());
  let npcUid = _npcUid;
  const [isShowingHistory, setShowHistory] = React.useState(false);
  const { npcHistory, pushNpc } = useNpcHistory();

  const generateNpc = (npcOptions: NpcGenerateOptions) => {
    const result = generate({ npcOptions });
    if (process.env.NODE_ENV === "development") {
      console.log(debugNodeToString(result.debugNode));
    }
    const npc: GeneratedNpc = {
      npc: result.npc,
      uid: uuidV4(),
      generatedAt: new Date().toISOString(),
    };
    setShowHistory(false);
    setNpc(npc);
    pushNpc(npc);
    return npc;
  };

  // Generate initial npc, if we didn't load data from url query
  if (!npcUid) {
    npcUid = generateNpc({});
  }

  const handleToggleHistory = () => setShowHistory(!isShowingHistory);
  const handleLoadNpc = (npc: GeneratedNpc): void => {
    setNpc(npc);
    setShowHistory(false);
    document.scrollingElement?.scrollTo?.(0, 0);
  };

  return (
    <>
      <div className="display-npc-root">
        <Row>
          <Col sm={12} md={4} lg={3} className="user-info-col">
            <div className="user-info">
              <div className="title-image-wrapper">
                <div className="title-image" />
              </div>
              <UserInput npc={npcUid.npc} generate={generateNpc} onToggleHistory={handleToggleHistory} />
            </div>
          </Col>
          <Col sm={12} md={7} lg={9}>
            {isShowingHistory ? <NpcHistory activeNpcUid={npcUid.uid || ""} npcHistory={npcHistory} onLoadNpc={handleLoadNpc} /> : <NpcData npc={npcUid.npc} />}
            <Footer />
          </Col>
        </Row>
      </div>
      <div className="printing">
        <h1 className="print-title">{npcUid.npc.description.name}</h1>
        <NpcData npc={npcUid.npc} />
      </div>
    </>
  );
}

function useNpcFromQuery(): GeneratedNpc | null {
  const url = new URL(window.location.href);
  if (url.searchParams.has("d")) {
    try {
      const crushedJson = url.searchParams.get("d") || "";
      const npc: Npc | null = JSON.parse(jsoncrush.uncrush(decodeURIComponent(crushedJson)));
      return npc ? { npc, uid: crushedJson } : null;
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}