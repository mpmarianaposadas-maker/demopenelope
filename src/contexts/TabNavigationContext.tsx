import { createContext, useContext } from 'react';

interface TabNavigationContextType {
  goToTab: (tabId: string) => void;
  visitedTabs: Set<string>;
}

export const TabNavigationContext = createContext<TabNavigationContextType>({
  goToTab: () => {},
  visitedTabs: new Set(),
});

export function useTabNavigation() {
  return useContext(TabNavigationContext);
}
