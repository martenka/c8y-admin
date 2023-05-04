import { Typography } from '@mui/material';
import { ThemedSiderV2 } from '@refinedev/mui';

export const CustomSider = () => {
  return (
    <ThemedSiderV2
      Title={() => {
        return (
          <Typography fontWeight={'bold'} display={'flex'}>
            Admin app
          </Typography>
        );
      }}
      render={({ items, logout }) => {
        return (
          <>
            {items}
            {logout}
          </>
        );
      }}
    />
  );
};
