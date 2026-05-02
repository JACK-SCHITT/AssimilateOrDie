import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Mission, MISSIONS, RANKS, Rank } from '@/constants/data';

interface UserProfile {
  name: string;
  handle: string;
  xp: number;
  toolsExplored: string[];
  chatMessagesSent: number;
  appsSubmitted: number;
  lessonsCompleted: number;
  missions: Mission[];
}

interface AppContextType {
  user: UserProfile;
  currentRank: Rank;
  nextRank: Rank | null;
  xpProgress: number; // 0–1
  addXP: (amount: number) => void;
  markToolExplored: (toolId: string) => void;
  incrementChat: () => void;
  completeMission: (missionId: string) => void;
  completeLesson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getRank(xp: number): Rank {
  return RANKS.slice().reverse().find(r => xp >= r.minXP) || RANKS[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: 'NEW RECRUIT',
    handle: '@initiate_001',
    xp: 0,
    toolsExplored: [],
    chatMessagesSent: 0,
    appsSubmitted: 0,
    lessonsCompleted: 0,
    missions: MISSIONS,
  });

  const addXP = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const markToolExplored = useCallback((toolId: string) => {
    setUser(prev => {
      if (prev.toolsExplored.includes(toolId)) return prev;
      const updated = { ...prev, toolsExplored: [...prev.toolsExplored, toolId] };
      // Mission: First Assimilation
      const missions = updated.missions.map(m =>
        m.id === '1' && !m.completed ? { ...m, completed: true } : m
      );
      // Mission: Tool Master (all 10)
      const missions2 = missions.map(m =>
        m.id === '5' && !m.completed && updated.toolsExplored.length >= 9
          ? { ...m, completed: true }
          : m
      );
      return { ...updated, missions: missions2 };
    });
  }, []);

  const incrementChat = useCallback(() => {
    setUser(prev => {
      const newCount = prev.chatMessagesSent + 1;
      const missions = prev.missions.map(m =>
        m.id === '2' && !m.completed && newCount >= 5 ? { ...m, completed: true } : m
      );
      return { ...prev, chatMessagesSent: newCount, missions };
    });
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setUser(prev => {
      const mission = prev.missions.find(m => m.id === missionId);
      if (!mission || mission.completed) return prev;
      const missions = prev.missions.map(m =>
        m.id === missionId ? { ...m, completed: true } : m
      );
      return { ...prev, missions, xp: prev.xp + mission.xp };
    });
  }, []);

  const completeLesson = useCallback(() => {
    setUser(prev => {
      const newCount = prev.lessonsCompleted + 1;
      const missions = prev.missions.map(m =>
        m.id === '4' && !m.completed && newCount >= 3 ? { ...m, completed: true } : m
      );
      return { ...prev, lessonsCompleted: newCount, missions };
    });
  }, []);

  const currentRank = getRank(user.xp);
  const nextRank = RANKS.find(r => r.level === currentRank.level + 1) || null;
  const xpProgress = nextRank
    ? (user.xp - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)
    : 1;

  return (
    <AppContext.Provider value={{ user, currentRank, nextRank, xpProgress, addXP, markToolExplored, incrementChat, completeMission, completeLesson }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
