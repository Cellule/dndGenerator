import styles from "./NpcHistory.module.css";
import { GeneratedNpc } from "./typings";

interface Props {
  npcHistory: GeneratedNpc[];
  activeNpcUid: string;
  onLoadNpc: (npc: GeneratedNpc) => void;
}

export function NpcHistory({ npcHistory, activeNpcUid, onLoadNpc }: Props) {
  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.historyHeader}>NPC History</h2>
      <ul className={styles.historyList}>
        {npcHistory.map(({ npc, uid }) => (
          <li key={uid} className={`${styles.historyItem} ${activeNpcUid === uid ? styles.selected : ""}`} onClick={() => onLoadNpc({ npc, uid })}>
            {npc.description.name} is a {npc.description.age} year old {npc.description.gender.toLowerCase()} {npc.description.race.toLowerCase()}{" "}
            {npc.description.occupation.toLowerCase()}.
          </li>
        ))}
      </ul>
    </div>
  );
}
