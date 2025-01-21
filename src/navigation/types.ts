
export enum ROUTES {
    HOME = 'Home',
    STATS = 'Stats',
    SPLIT = 'Split',
    NOTIFICATIONS = 'Notifications',
    SETTINGS = 'Settings',
  }

  export type RootTabParamList = {
    [ROUTES.HOME]: undefined;
    [ROUTES.STATS]: undefined;
    [ROUTES.SPLIT]: undefined;
    [ROUTES.NOTIFICATIONS]: undefined;
    [ROUTES.SETTINGS]: undefined;
  };

  export type RootTabNavigationProp<T extends keyof RootTabParamList> = {
    navigate: (screen: keyof RootTabParamList, params?: RootTabParamList[T]) => void;
    goBack: () => void;
  };
  
  export type RootTabRouteProp<T extends keyof RootTabParamList> = {
    key: string;
    name: T;
    params: RootTabParamList[T];
  };
  

  export type TabIconMapping = {
    [key in ROUTES]: string;
  };

  export const TAB_ICONS: TabIconMapping = {
    [ROUTES.HOME]: 'home',
    [ROUTES.STATS]: 'bar-chart',
    [ROUTES.SPLIT]: 'people',
    [ROUTES.NOTIFICATIONS]: 'notifications',
    [ROUTES.SETTINGS]: 'settings',
  };
  
  export type TabBarColors = {
    active: string;
    inactive: string;
  };