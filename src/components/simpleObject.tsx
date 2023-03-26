import { TextFieldComponent as TextField } from '@refinedev/mui';
import { Stack, Typography } from '@mui/material';

export const SimpleObject = (props: {
  value: Record<string | number, string>;
}): JSX.Element => {
  const value = props?.value;
  return (
    <>
      <Stack direction="column" contentEditable={false} spacing={1}>
        {Object.keys(value).map((key) => {
          return (
            <Stack
              direction="row"
              key={key}
              spacing={2}
              contentEditable={false}
            >
              <Typography variant="body2" fontWeight="bold">
                {key}
              </Typography>
              <TextField value={value[key]} contentEditable={false} />
            </Stack>
          );
        })}
      </Stack>
    </>
  );
};
