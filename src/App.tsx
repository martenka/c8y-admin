import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from '@refinedev/mui';

import { CssBaseline, GlobalStyles } from '@mui/material';
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { SensorEdit, SensorsList } from './pages/sensors';

import { useTranslation } from 'react-i18next';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { authProvider, createBaseDataProvider } from './providers';
import { Header } from './components';
import { ColorModeContextProvider } from './contexts/color-mode';
import { Login } from './pages/login';
import { FilesList } from 'pages/files/list';
import { TasksList } from './pages/tasks/list';
import { SensorShow } from './pages/sensors';
import { TaskCreate } from './pages/tasks/create';
import { GroupsList } from './pages/groups/list';
import { GroupShow } from './pages/groups/show';
import { FileShow } from './pages/files/show';
import { TaskShow } from './pages/tasks/show';
import { CustomSider } from './components/sider/sider';

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={{
                ...createBaseDataProvider(
                  `${process.env.REACT_APP_DOMAIN}/v1/`,
                ),
              }}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: 'sensors',
                  list: '/sensors',
                  show: '/sensors/show/:id',
                  edit: '/sensors/edit/:id',
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: 'files',
                  list: '/files',
                  show: '/files/show/:id',
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: 'tasks',
                  list: '/tasks',
                  create: '/tasks/create',
                  show: '/tasks/show/:id',
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: 'groups',
                  list: '/groups',
                  show: '/groups/show/:id',
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2 Header={Header} Sider={CustomSider}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="sensors" />}
                  />
                  <Route path="/sensors">
                    <Route index element={<SensorsList />} />
                    <Route path="show/:id" element={<SensorShow />} />
                    <Route path="edit/:id" element={<SensorEdit />} />
                  </Route>
                  <Route path="/groups">
                    <Route index element={<GroupsList />} />
                    <Route path="show/:id" element={<GroupShow />} />
                  </Route>
                  <Route path="/files">
                    <Route index element={<FilesList />} />
                    <Route path="show/:id" element={<FileShow />} />
                  </Route>
                  <Route path="/tasks">
                    <Route index element={<TasksList />} />
                    <Route path="create" element={<TaskCreate />} />
                    <Route path="show/:id" element={<TaskShow />} />
                  </Route>
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource resource={'sensors'} />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
                <Route
                  element={
                    <Authenticated>
                      <ThemedLayoutV2 Header={Header}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
