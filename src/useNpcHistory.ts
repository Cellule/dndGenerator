import React from "react";
import { getItem, setItem } from "./browserStorage";
import { GeneratedNpc } from "./typings";

export function useNpcHistory() {
  const [npcHistory, setNpcHistory] = React.useState(() => getHistoryFromStorage() || []);

  const pushNpc = React.useCallback(
    (npc: GeneratedNpc) => {
      const currentHistory = getHistoryFromStorage() || npcHistory;
      const newHistory = [npc, ...currentHistory];
      if (newHistory.length > 100) {
        newHistory.length = 100;
      }
      setItem("npcHistory", newHistory);
      setNpcHistory(newHistory);
    },
    [npcHistory],
  );

  return { npcHistory, pushNpc };
}

function getHistoryFromStorage() {
  const history = getItem("npcHistory");
  if (!history || !Array.isArray(history)) {
    return null;
  }
  return history.filter((item) => item?.uid && item?.npc);
}
